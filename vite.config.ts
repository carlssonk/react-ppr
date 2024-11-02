import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

const baseConfig: UserConfig = {
  plugins: [TanStackRouterVite(), react()],
  preview: {
    proxy: {
      // Proxy HTML request (/ /about /users/profile etc.) to the cloudflare worker and let vite serve the static assets (.js .css etc.)
      '^/(?![^/]+\.[^/]+$)[^\?]*$': {
        target: 'http://localhost:8787',
      }
  },
},
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, isPreview }) => {
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
          input: 'src/client.tsx',
          output: {
            // Ensure stable chunk names
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          }
        }
      }
      // preview: {
      //   ...baseConfig.preview,
      //   dir: 'client'
      // }
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
          input: 'src/server/app.tsx'
        }
      }
    }
  }

  return baseConfig
})
// export default defineConfig({
//   
//   // define: {
//   //   IS_PRERENDER: JSON.stringify(false),
//   //   IS_BUILDING: JSON.stringify(process.argv.includes('build')),
//   //   // 'process.env.NODE_ENV': '"development"'
//   // },
//   // mode: 'development', // Force development mode
//   build: {
//     ssr: true,
//     outDir: 'dist/prerender',
//     rollupOptions: {
//       input: 'src/server/app.tsx'
//     }
//   },
//   // build: {
//   //   manifest: true,
//   //   rollupOptions: {
//   //     input: {
//   //       client: 'src/client.tsx',
//   //       // server: 'src/server/app.tsx',
//   //       // 'main.css': './src/main.css',
//   //     },
//   //     output: {
//   //       // Ensure stable chunk names
//   //       chunkFileNames: 'assets/[name]-[hash].js',
//   //       entryFileNames: 'assets/[name]-[hash].js',
//   //       assetFileNames: 'assets/[name]-[hash][extname]'

//   //     },
//   //   },
//   //   // minify: false, // Disable minification for better error messages
//   //   // sourcemap: true, // Enable source maps
//   //   // assetsDir: 'src/assets',
//   //   ssr: 'server'
//   // },



//   // build: {
//   //   // manifest: true,
//   //   rollupOptions: {
//   //     input: mode === 'server' 
//   //       ? { server: resolve(__dirname, 'src/ssr.tsx') }
//   //       : { client: resolve(__dirname, 'src/client/index.tsx') },
//   //     output: mode === 'server' 
//   //       ? {
//   //           // Server bundle
//   //           dir: 'dist/server',
//   //           format: 'cjs',
//   //           entryFileNames: '[name].js',
//   //           preserveModules: true,
//   //           exports: 'named',
//   //         }
//   //       : {
//   //           // Client bundle
//   //           dir: 'dist/client',
//   //           format: 'esm',
//   //           entryFileNames: '[name].[hash].js',
//   //           chunkFileNames: '[name].[hash].js',
//   //           assetFileNames: '[name].[hash].[ext]',
//   //         }
//   //   },
//   // //   assetsDir: "src/public",
//   // //   ssr: mode === 'server',
//   // //   target: mode === 'server' ? 'node18' : 'modules',
//   // },
//   // ssr: mode === 'server' 
//   //   ? {
//   //       noExternal: [
//   //         'use-sync-external-store',
//   //         'use-sync-external-store/shim',
//   //         'use-sync-external-store/shim/with-selector'
//   //       ]
//   //     }
//   //   : undefined,
//   // ssr: {
//   //   noExternal: [
//   //     /\.css$/,           // All CSS files
//   //   ],
//   // },
//   preview: {

//     },
//     // middlewareMode: true
// },
// })
