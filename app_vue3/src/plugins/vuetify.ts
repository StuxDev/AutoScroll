/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  ssr: true,
  theme: {
    defaultTheme: 'darkRed',
    themes: {
      darkRed: {
        dark: true, // This enables dark mode for this specific theme
        colors: {
          background: '#121212', // Standard dark background
          surface: '#1E1E1E',    // Slightly lighter dark for cards/dialogs
          primary: '#FF5252',    // Vibrant red that works well on dark
          secondary: '#B71C1C',  // Deep blood red
          error: '#CF6679',      // Desaturated red for accessibility
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
})
