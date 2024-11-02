/* eslint-disable @typescript-eslint/no-explicit-any */
import { build, createServer, ViteDevServer } from 'vite';
import { fileURLToPath } from 'url';

import path from 'path';
import fs from 'fs';
import { generate } from 'critical';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prerender = async () => {
  const viteManifestPath = path.join(__dirname, '../dist/client/.vite/manifest.json')
  const viteManifest = await import(viteManifestPath);
  global.__VITE_MANIFEST__ = viteManifest.default;

  const prerenderDir = path.join(__dirname, '../dist/prerender')

  // Load lambda handler
  const { handler, routeTreeChildren } = await import(`${prerenderDir}/app.js`);
  const routePaths = routeTreeChildren.map((route: { options: { path: string; }; }) => route.options.path)

  // For each routes, create a prerender
  const promises = routePaths.map(async (path: string) => {
    const data = await handler({ queryStringParameters: { path } });
    return { data, path };
  });

  const results = await Promise.all(promises);

  // (Re)create routes folder
  const routesDir = path.join(prerenderDir, 'routes')
  if (fs.existsSync(routesDir)) {
    fs.rmSync(routesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(routesDir);

  // Write prerendered data to json
  for (const { data, path } of results) {
    // console.log('ASDASD')
    // console.log(data)
    fs.writeFile(`${routesDir}${path === '/' ? '/index' : path}.json`, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        throw new Error(`${err}`)
      }
      console.log('Prerendered route: ' + path);
    });
  }

  // const output = await generate({
  //   inline: true,
  //   // base: 'test/',
  //   html: results[0].data.prelude,
  //   css: ''
  //   // target: 'index-critical.html',
  //   width: 1300,
  //   height: 900,
  // });

  // console.log(output)

}

(async () => {
  // const vite = await createServer({
  //   // ...viteConfig,
  //   define: {
  //     IS_PRERENDER: JSON.stringify(true),
  //   },
  //   // plugins: [
  //   //   ...(viteConfig.plugins || []),
  //   //   {
  //   //     name: 'asset-resolver',
  //   //     async transform(_code, id) {

  //   //       const srcAssets = 'src/assets/'
  //   //       if (id.includes(srcAssets)) {

  //   //         const assetKey = id.split(srcAssets)[1]
  //   //         const manifestKey = srcAssets + assetKey
            
  //   //         return {
  //   //           code: `
  //   //             export default "${manifest[manifestKey]?.file ? '/' + manifest[manifestKey].file : id}"
  //   //           `,
  //   //           map: null
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   // ],
  //   // server: {
  //   //   middlewareMode: true,
  //   //   preTransformRequests: true, // This will make Vite pre-transform assets like in production
  //   // },
  //   // appType: 'custom',
  //   // assetsInclude: ['**/*.png', '**/*.svg'],
  //   // ssr: {
  //   //   noExternal: [
  //   //     /\.css$/,           // All CSS files
  //   //   ],
  //   // }
  // });

  await prerender()

  // await vite.close();
})()