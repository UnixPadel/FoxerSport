import { defineStore } from 'pinia'

export const useRecentlyViewedStore = defineStore('recentlyViewed', {
  state: () => ({
    viewedIds: JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  }),
  
  actions: {
    addViewerProduct(productId) {
      if (!productId) return
      
      // Remove if it already exists to put it at the front
      this.viewedIds = this.viewedIds.filter(id => id !== productId)
      
      // Add to front
      this.viewedIds.unshift(productId)
      
      // Keep only last 10
      if (this.viewedIds.length > 10) {
        this.viewedIds.pop()
      }
      
      // Save to localStorage
      localStorage.setItem('recentlyViewed', JSON.stringify(this.viewedIds))
    },
    
    clear() {
      this.viewedIds = []
      localStorage.removeItem('recentlyViewed')
    }
  }
})
