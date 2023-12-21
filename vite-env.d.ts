/// <reference types="vite/client" />
/// <reference types="unplugin-vue-macros/macros-global" />

interface ImportMetaEnv {
  readonly VITE_APP_BSKY_APP_PASSWORD: string
  readonly VITE_APP_BSKY_SERVICE: string// more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
