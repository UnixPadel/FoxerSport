import { defineStore } from 'pinia'
import api from '../api'
import { useCurrencyStore } from './currency'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  
  getters: {
    cartTotal: (state) => {
      const currencyStore = useCurrencyStore()
      const curr = currencyStore.currency
      return state.items.reduce((total, item) => {
        let p = 0
        if (curr === 'TRY') p = item.priceTry || item.price || 0
        else if (curr === 'USD') p = item.priceUsd || (item.priceTry / 33) || 0
        else if (curr === 'EUR') p = item.priceEur || (item.priceTry / 35) || 0
        return total + (p * item.quantity)
      }, 0)
    },
    cartItemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    }
  },
  
  actions: {
    async fetchCart() {
      // If user is not authenticated, we use localStorage for guest cart
      if (!localStorage.getItem('token')) {
        const localCart = localStorage.getItem('guestCart')
        if (localCart) {
          let parsedCart = JSON.parse(localCart)
          // Clean up corrupted items from previous bug
          parsedCart = parsedCart.filter(item => item.price > 0 && !item.name.startsWith('Product undefined'))
          // Fix existing relative image URLs
          parsedCart = parsedCart.map(item => {
            if (item.image && typeof item.image === 'string' && item.image.startsWith('/uploads/')) {
              item.image = `http://localhost:3000${item.image}`;
            }
            return item;
          })
          this.items = parsedCart
          localStorage.setItem('guestCart', JSON.stringify(parsedCart))
        }
        return
      }

      this.loading = true
      try {
        const res = await api.get('/cart')
        if (res.data.status === 'success' && res.data.cartItems) {
          this.items = res.data.cartItems.map(item => {
            let imgUrl = item.product?.images?.[0]?.url || 'https://foxersport.com/image/cache/catalog/clothing-994x540.png';
            if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('/uploads/')) {
              imgUrl = `http://localhost:3000${imgUrl}`;
            }
            return {
              id: item.id,
              productId: item.productId,
              name: item.product?.translations?.[0]?.name || item.product?.slug,
              priceTry: parseFloat(item.product?.priceTry || 0),
              priceUsd: parseFloat(item.product?.priceUsd || 0),
              priceEur: parseFloat(item.product?.priceEur || 0),
              price: parseFloat(item.product?.priceTry || 0), // fallback
              quantity: item.quantity,
              image: imgUrl
            };
          });
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        this.loading = false
      }
    },

    async addToCart(product, quantity = 1) {
      if (!product || !product.id) return false
      
      if (!localStorage.getItem('token')) {
        // Guest cart
        const existing = this.items.find(i => i.productId === product.id)
        if (existing) {
          existing.quantity += quantity
        } else {
          const name = product.translations?.[0]?.name || product.slug || 'Unknown Product'
          const priceTry = parseFloat(product.priceTry || 0)
          const priceUsd = parseFloat(product.priceUsd || 0)
          const priceEur = parseFloat(product.priceEur || 0)
          
          let image = 'https://foxersport.com/image/cache/catalog/clothing-994x540.png'
          if (product.images && product.images.length > 0) {
             image = typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || image)
          }
          if (image && typeof image === 'string' && image.startsWith('/uploads/')) {
            image = `http://localhost:3000${image}`;
          }

          this.items.push({ 
            id: Math.random().toString(36).substring(7), // Generate fake ID for guest cart item
            productId: product.id, 
            quantity, 
            priceTry,
            priceUsd,
            priceEur,
            price: priceTry, 
            name, 
            image 
          })
        }
        localStorage.setItem('guestCart', JSON.stringify(this.items))
        return true
      }

      this.loading = true
      try {
        const res = await api.post('/cart', { productId: product.id, quantity })
        if (res.data.status === 'success') {
          await this.fetchCart() // Refresh cart from server
          return true
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async updateQuantity(cartItemId, quantity) {
      if (!localStorage.getItem('token')) {
        const item = this.items.find(i => i.id === cartItemId)
        if (item) item.quantity = quantity
        localStorage.setItem('guestCart', JSON.stringify(this.items))
        return
      }

      try {
        await api.put(`/cart/${cartItemId}`, { quantity })
        await this.fetchCart()
      } catch (error) {
        console.error('Error updating cart:', error)
      }
    },

    async removeItem(cartItemId) {
      if (!localStorage.getItem('token')) {
        this.items = this.items.filter(i => i.id !== cartItemId)
        localStorage.setItem('guestCart', JSON.stringify(this.items))
        return
      }

      try {
        await api.delete(`/cart/${cartItemId}`)
        await this.fetchCart()
      } catch (error) {
        console.error('Error removing item:', error)
      }
    },

    clearCart() {
      this.items = []
      localStorage.removeItem('guestCart')
    },

    async mergeGuestCart() {
      const localCart = localStorage.getItem('guestCart')
      if (!localCart || !localStorage.getItem('token')) return

      try {
        let parsedCart = JSON.parse(localCart)
        if (parsedCart && parsedCart.length > 0) {
          // Clean up corrupted items before syncing
          parsedCart = parsedCart.filter(item => item.productId && item.price > 0 && !item.name.startsWith('Product undefined'))
          
          for (const item of parsedCart) {
            try {
              await api.post('/cart', { productId: item.productId, quantity: item.quantity })
            } catch (err) {
              console.error('Failed to sync item', item.productId, err)
            }
          }
          localStorage.removeItem('guestCart')
          await this.fetchCart()
        }
      } catch (e) {
        console.error('Failed to merge guest cart', e)
        localStorage.removeItem('guestCart') // Clear it anyway if JSON is broken
      }
    }
  }
})
