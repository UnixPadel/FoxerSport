import { createI18n } from 'vue-i18n'
import tr from './locales/tr.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

// Supported locales
const supportedLocales = ['tr', 'en', 'fr', 'ar']

// Function to detect browser language
function getBrowserLocale() {
  // Get browser locale, fallback to 'en'
  const navigatorLocale = navigator.languages !== undefined ? navigator.languages[0] : navigator.language
  
  if (!navigatorLocale) return 'en'
  
  // Get just the 2-letter language code (e.g. 'fr-FR' -> 'fr')
  const langCode = navigatorLocale.split('-')[0].toLowerCase()
  
  // If the language code is in our supported list, use it
  if (supportedLocales.includes(langCode)) {
    return langCode
  }
  
  // Otherwise default to English
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getBrowserLocale(), // Automatically detected locale
  fallbackLocale: 'en',
  messages: {
    tr,
    en,
    fr,
    ar
  }
})

export default i18n
