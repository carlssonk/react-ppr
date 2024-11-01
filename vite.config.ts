import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const mode = process.env.BUILD_MODE || 'server'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  define: {
    IS_PRERENDER: JSON.stringify(false)
  },
  build: {
    // manifest: true,
    rollupOptions: {
      input: mode === 'server' 
        ? { server: resolve(__dirname, 'src/server/lambda.tsx') }
        : { client: resolve(__dirname, 'src/client/index.tsx') },
      output: mode === 'server' 
        ? {
            // Server bundle
            dir: 'dist/server',
            format: 'cjs',
            entryFileNames: '[name].js',
            preserveModules: true,
            exports: 'named',
          }
        : {
            // Client bundle
            dir: 'dist/client',
            format: 'esm',
            entryFileNames: '[name].[hash].js',
            chunkFileNames: '[name].[hash].js',
            assetFileNames: '[name].[hash].[ext]',
          }
    },
  //   assetsDir: "src/public",
  //   ssr: mode === 'server',
  //   target: mode === 'server' ? 'node18' : 'modules',
  },
  // ssr: mode === 'server' 
  //   ? {
  //       noExternal: [
  //         'use-sync-external-store',
  //         'use-sync-external-store/shim',
  //         'use-sync-external-store/shim/with-selector'
  //       ]
  //     }
  //   : undefined,
  server: {
    proxy: {
      // Handle the root path differently
      '^/$': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // You can modify headers here if needed
            proxyReq.setHeader('X-Custom-Header', 'from-vite');
          });
        }
      },
      // Optional: Handle all HTML requests
      '^/(?!assets|@vite|@fs).*\\.(html)?$': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    },
},
})
