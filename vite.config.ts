import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { manifestTransformPlugin } from './vite-plugins/manifest-transform'
import { previewTransformPlugin } from './vite-plugins/preview-transform'

// https://vitejs.dev/config/

const baseConfig: UserConfig = {
  base: 'https://react-ppr-assets.carlssonk.com/',
  plugins: [TanStackRouterVite(), react()],
  define: {
    __BUILD_TARGET__: JSON.stringify(undefined),
    __DEV__: JSON.stringify(undefined)
  },
  preview: {
    proxy: {
      // Proxy initial HTML requests to the cloudflare worker
      '^\/([^\/]+\.html|[^.\/]+|)$': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            console.log('Sending Request to Target:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            console.log('Received Response from Target:', proxyRes.statusCode);
          });
        }
      }
    },
  },
}

export default defineConfig(({ mode, command, isPreview }) => {

  if (isPreview) {
    return {
      ...baseConfig,
      plugins: [
        ...baseConfig.plugins || [],
        previewTransformPlugin({ baseUrl: baseConfig.base, clientFolderPath: 'dist/client' })
      ]
    }
  }

  if (command === 'serve') {
    return {
      ...baseConfig,
      define: {
        ...baseConfig.define,
        __DEV__: JSON.stringify(true)
      }
    }
  }

  if (mode === 'client') {
    return {
      ...baseConfig,
      define: {
        ...baseConfig.define,
        __BUILD_TARGET__: JSON.stringify('client'),
      },
      build: {
          ...baseConfig.build,
        manifest: true,
        outDir: 'dist/client',
        rollupOptions: {
          input: 'src/entry-client.tsx',
          output: {
            assetFileNames: 'assets/[name]-[hash][extname]',
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            plugins: [manifestTransformPlugin({
              transformEntry: (entry) => ({
                ...entry,
                file: baseConfig.base + entry.file,
                ...(entry.assets && { 
                  assets: entry.assets.map(path => baseConfig.base + path) 
                }),
                ...(entry.css && { 
                  css: entry.css.map(path => baseConfig.base + path) 
                })
              })
            })]
          }
        }
      }
    }
  }

  if (mode === 'prerender') {
    return {
      ...baseConfig,
      define: {
        ...baseConfig.define,
        __BUILD_TARGET__: JSON.stringify('prerender'),
      },
      build: {
        ...baseConfig.build,
        ssr: true,
        outDir: 'dist/prerender',
        rollupOptions: {
          input: 'src/entry-server.tsx'
        }
      }
    }
  }

  if (mode === 'worker') {
    return {
      base: baseConfig.base,
      build: {
        ssr: true,
        outDir: 'dist/cloudflare',
        rollupOptions: {
          input: 'src/worker.ts',
        }
      }
    }
  }

  return baseConfig
})