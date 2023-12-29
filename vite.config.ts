import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import removeConsole from 'vite-plugin-remove-console'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

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
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ['path', 'net', 'stream', 'util'],
      // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
      exclude: [
        'http' // Excludes the polyfill for `http` and `node:http`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true
      },
      // Override the default polyfills for specific modules.
      protocolImports: true
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
