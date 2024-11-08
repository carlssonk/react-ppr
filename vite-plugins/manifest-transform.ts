import { Plugin } from 'vite'
import { OutputBundle, OutputAsset } from 'rollup'
import path from 'path'
import fs from 'fs'
import { ManifestChunk } from 'vite'

interface TransformManifestOptions {
  transformEntry: (entry: ManifestChunk) => ManifestChunk
}

export function manifestTransformPlugin(options: TransformManifestOptions): Plugin {
  return {
    name: 'manifest-transform',
    enforce: 'post',
    async writeBundle(bundleOptions, bundle: OutputBundle) {
      const manifestFile = Object.keys(bundle).find(file => 
        file.endsWith('manifest.json')
      )

      if (!manifestFile) return

      const bundleEntry = bundle[manifestFile]
      if (!('source' in bundleEntry) || bundleEntry.type !== 'asset') return

      const manifestAsset = bundleEntry as OutputAsset
      const manifestContent = typeof manifestAsset.source === 'string'
        ? manifestAsset.source
        : Buffer.from(manifestAsset.source).toString('utf-8')

      const manifest = JSON.parse(manifestContent)

      // Transform each entry using the provided transform function
      const transformedManifest = Object.entries(manifest).reduce<Record<string, ManifestChunk>>(
        (acc, [key, entry]) => {
          acc[key] = options.transformEntry(entry as ManifestChunk)
          return acc
        }, 
        {}
      )

      const manifestPath = path.resolve(String(bundleOptions.dir), manifestAsset.fileName)

      fs.writeFileSync(
        manifestPath,
        JSON.stringify(transformedManifest, null, 2)
      )
    }
  }
}