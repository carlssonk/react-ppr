import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project must be built before prerendering

(async () => {
  const viteManifestPath = path.join(__dirname, '../dist/client/.vite/manifest.json')
  const viteManifest = await import(viteManifestPath);
  global.__VITE_MANIFEST__ = viteManifest.default;

  const prerenderDir = path.join(__dirname, '../dist/prerender')
  const preludeDir = path.join(__dirname, '../dist/client/routes/prelude')
  const postponedDir = path.join(__dirname, '../dist/client/routes/postponed')

  // Load lambda handler
  const { handler, routeTreeChildren } = await import(`${prerenderDir}/entry-server.js`);
  const routePaths = routeTreeChildren.map((route: { options: { path: string; }; }) => route.options.path)

  // For each routes, create a prerender
  const promises = routePaths.map(async (path: string) => {
    const data = await handler({ queryStringParameters: { path } });
    return { data, path };
  });

  const results = await Promise.all(promises);

  await Promise.all([
    fs.emptyDir(preludeDir),
    fs.emptyDir(postponedDir)
  ]);

  // Write prerendered data
  for (const { data, path } of results) {
    const fileName = `${path === '/' ? 'index' : path.slice(1).replaceAll('/', '_')}`

    fs.writeFile(`${preludeDir}/${fileName}.html`, data.prelude, (err) => {
      if (err) {
        throw new Error(`${err}`)
      }
    });

    fs.writeFile(`${postponedDir}/${fileName}.json`, JSON.stringify(data.postponed === null ? {} : data.postponed), (err) => {
      if (err) {
        throw new Error(`${err}`)
      }
    });

    console.log('Prerendered route: ' + path);
  }
})()