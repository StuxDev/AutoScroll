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

export default createVuetify({
  ssr: true,
  theme: {
    defaultTheme: 'redditDark',
    themes: {
      redditDark: {
        dark: true,
        colors: {
          background: '#1A1A1B',
          surface: '#272729',
          'surface-variant': '#1A1A1B',
          'on-surface-variant': '#D7DADC',
          primary: '#FF4500',    // Reddit orangered
          secondary: '#0DD3BB',  // Reddit teal
          error: '#FF585B',
          info: '#24A0ED',
          success: '#46D160',
          warning: '#FFB000',
          anchor: '#FF4500',
        },
      },
    },
  },
})
