/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer, ViteDevServer } from 'vite';
import viteConfig from '../../vite.config.js';
import { writeFile } from 'node:fs';

const prerender = async (vite: ViteDevServer) => {
  const { routeTreeChildren } = await vite.ssrLoadModule('./src/main.tsx');
  const routePaths = routeTreeChildren.map((route: { options: { path: string; }; }) => route.options.path)

  const { handler } = await vite.ssrLoadModule('./src/server/app.tsx');

  const promises = routePaths.map(async (path: string) => {
    const data = await handler({ queryStringParameters: { path } });
    return { data, path };
  });

  const results = await Promise.all(promises);

  for (const { data, path } of results) {
    writeFile(`./src/prerender${path === '/' ? '/index' : path}.json`, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        throw new Error(`${err}`)
      }
      console.log('Prerender complete - data written to data.json');
    });
  }
}

(async () => {
  const vite = await createServer({
    ...viteConfig,
    define: {
      IS_PRERENDER: JSON.stringify(true),
    }
  });

  await prerender(vite)

  await vite.close();
})()