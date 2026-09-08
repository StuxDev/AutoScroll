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

// Resolves the theme to render on first paint, before Pinia/the settings
// store exist - reads localStorage directly (same key useAppTheme.ts writes)
// so there's no flash of the wrong theme while the app boots.
function resolveInitialTheme(): 'redditDark' | 'redditLight' {
  const stored = localStorage.getItem('themeMode')
  if (stored === 'light') return 'redditLight'
  if (stored === 'dark') return 'redditDark'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'redditDark' : 'redditLight'
}

export default createVuetify({
  ssr: true,
  theme: {
    defaultTheme: resolveInitialTheme(),
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
      redditLight: {
        dark: false,
        colors: {
          background: '#F5F5F5',
          surface: '#FFFFFF',
          'surface-variant': '#F5F5F5',
          'on-surface-variant': '#4A4A4A',
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
