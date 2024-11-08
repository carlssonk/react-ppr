import { Plugin } from 'vite'
import path from 'path'
import fs from 'fs-extra'
import { replaceInFile } from 'replace-in-file'

interface PreviewTransformOptions {
  baseUrl?: string
  clientFolderPath: string
}

export function previewTransformPlugin(options: PreviewTransformOptions): Plugin {
  const {
    baseUrl = '/',
    clientFolderPath
  } = options

  return {
    name: 'preview-transform',
    async configurePreviewServer(server) {
      const dotPreviewDir = path.resolve('dist/.preview')
      const targetDir = path.join(dotPreviewDir, path.basename(clientFolderPath))
      
      return () => {
        server.httpServer?.once('listening', async () => {
          try {
            await fs.copy(clientFolderPath, targetDir, { overwrite: true })
            await replaceInFile({
              files: dotPreviewDir + '/**/*',
              from: `/${baseUrl}/g`,
              to: '/'
            })
          } catch (err) {
            console.error(err)
          }
        })
      }
    }
  }
}