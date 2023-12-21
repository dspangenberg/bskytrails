import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import removeConsole from 'vite-plugin-remove-console'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
              // customize plugin options
                convertColors: {
                  currentColor: true
                }
              }
            }
          },
          {
            name: 'removeAttrs',
            params: {
              attrs: 'stroke-width'
            }
          }
        ]
      }
    }),
    removeConsole(),
    VueI18nPlugin({
      include: path.resolve(__dirname, './src/locales/**'),
      jitCompilation: true
    }),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: false,
      deep: true,
      directoryAsNamespace: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
