// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts-next'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import process from 'node:process'

// The app shows the repo's Date Version (VERSION.md), not the frontend package's own version
const appVersion = readFileSync(new URL('../VERSION.md', import.meta.url), 'utf-8').trim()

// dev-server.sh/.bat --lan sets this to the local Firebase emulator (http://127.0.0.1:5001). The
// frontend then calls /__emulator/... on its own address, and Vite forwards those calls to the
// emulator, so a phone on the network only needs to reach Vite. The forwarded calls carry a
// localhost Origin, which the backend allows in development.
const emulatorProxy = process.env.AUTOSCROLL_EMULATOR_PROXY

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Layouts(),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router/auto': ['useRoute', 'useRouter'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      google: {
        families: [{
          name: 'Plus Jakarta Sans',
          styles: 'wght@300;400;500;600;700;800',
        }],
      },
    }),
  ],
  define: {
    'process.env': {},
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
    ...(emulatorProxy
      ? {
          proxy: {
            '/__emulator': {
              target: emulatorProxy,
              rewrite: (path: string) => path.replace(/^\/__emulator/, ''),
              headers: { origin: 'http://127.0.0.1:3000' },
            },
          },
        }
      : {}),
  },
})
