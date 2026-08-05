import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref(localStorage.getItem('currency') || 'TRY')

  const setCurrency = (curr) => {
    currency.value = curr
    localStorage.setItem('currency', curr)
  }

  return { currency, setCurrency }
})
