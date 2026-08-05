import { defineStore } from 'pinia'
import api from '../api'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  
  getters: {
    wishlistItemCount: (state) => {
      return state.items.length
    },
    isInWishlist: (state) => (productId) => {
      return state.items.some(item => item.productId === productId || item.id === productId)
    }
  },
  
  actions: {
    async fetchWishlist() {
      // If user is not authenticated, we use localStorage
      if (!localStorage.getItem('token')) {
        const localWishlist = localStorage.getItem('guestWishlist')
        if (localWishlist) {
          this.items = JSON.parse(localWishlist)
        }
        return
      }

      this.loading = true
      try {
        const res = await api.get('/wishlist')
        if (res.data.status === 'success') {
          // Format API items
          this.items = res.data.wishlist.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.product?.translations?.[0]?.name || item.product?.slug,
            price: parseFloat(item.product?.priceTry || 0),
            image: item.product?.images?.[0]?.url || 'https://foxersport.com/image/cache/catalog/clothing-994x540.png',
            slug: item.product?.slug
          }))
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error)
      } finally {
        this.loading = false
      }
    },

    async toggleWishlist(product) {
      if (!product || !product.id) return false
      
      const isAlreadyAdded = this.isInWishlist(product.id)
      
      if (!localStorage.getItem('token')) {
        // Guest
        if (isAlreadyAdded) {
          this.items = this.items.filter(i => i.productId !== product.id && i.id !== product.id)
        } else {
          const name = product.translations?.[0]?.name || product.slug || 'Unknown Product'
          const price = parseFloat(product.priceTry || 0)
          
          let image = 'https://foxersport.com/image/cache/catalog/clothing-994x540.png'
          if (product.images && product.images.length > 0) {
             image = typeof product.images[0] === 'string' ? product.images[0] : (product.images[0].url || image)
          }

          this.items.push({ 
            id: product.id, // For guest, id is productId
            productId: product.id, 
            price, 
            name, 
            image,
            slug: product.slug
          })
        }
        localStorage.setItem('guestWishlist', JSON.stringify(this.items))
        return !isAlreadyAdded
      }

      // Authenticated
      this.loading = true
      try {
        if (isAlreadyAdded) {
          // The backend expects productId for delete, let's assume it. Or we fetch cart ID? 
          // Actually, our API delete might take the wishlist entry ID or ProductID.
          // In wishlist.routes.js: router.delete('/:productId', removeFromWishlist);
          await api.delete(`/wishlist/${product.id}`)
        } else {
          await api.post('/wishlist', { productId: product.id })
        }
        await this.fetchWishlist()
        return !isAlreadyAdded
      } catch (error) {
        console.error('Error toggling wishlist:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    async removeItem(productId) {
       await this.toggleWishlist({id: productId}); // Dummy object just for ID to toggle it off
    }
  }
})
