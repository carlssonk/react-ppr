 
import { prelude as preludeIndex } from '../../dist/prerender/routes/index.json';
import { prelude as preludeAbout } from '../../dist/prerender/routes/about.json';
// import { generateHTML } from './template';

// interface Env {
//   APP_URL: string
// }


const headers = {
  'Content-Type': 'text/html; charset=utf-8',
  'Transfer-Encoding': 'chunked',
  // set caching header so it never caches
  'Cache-Control':
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
};

export default {
  async fetch(request: Request) {
    // we want to start a new reponse that first writes the prelude HTML,
    // then streams restOfResponse

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            console.log('HELLO')
            // console.log(request)
            const url = new URL(request.url);
            const pathname = url.pathname;
            // console.log(pathname)
            // const isHtmlRequest = isHtmlDocumentRequest(request, pathname);
            const prelude = pathname === "/" ? preludeIndex : preludeAbout
            
            console.log(prelude)
            console.log(pathname)
            // const html = injectExternalScript(prelude, './client/client.Vy0fZga6.js');
            // const html = injectExternalScript(prelude, './assets/client-DbWvQ1dq.js');
            // const html = `<html><body><div id="app">${prelude}</div><script src="./assets/client-DS71mhGp.js"></script></body></html>`
            controller.enqueue(new TextEncoder().encode(prelude));
            // if (isHtmlRequest) {
            //   // controller.enqueue(new TextEncoder().encode(generateHTML(prelude)));
            //   const restOfResponse = await fetch(`http://localhost:3000/dev?path=${pathname}`); // dynamic RSC api, can be lambda or ecs service etc.
            //   // await new Promise(res => setTimeout(res, 1000))
            //   // @ts-expect-error no types / TODO: is there a way to do this without the expect error?
            //   for await (const chunk of restOfResponse.body) {
            //     controller.enqueue(chunk);
            //   }
            // }

          } catch (error) {
            console.error(error);
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: [
          ...Object.entries(headers),
          // ['Link', '</dist/styles.css>; rel=preload; as=style'],
          // ['Link', '</dist/index.js>; rel=preload; as=script; crossorigin'],
          // ['Link', '<https://raw.githubusercontent.com>; rel=preconnect'],
        ],
      },
    );
  },
}

function injectExternalScript(htmlString, scriptSrc) {
  const bodyCloseIndex = htmlString.lastIndexOf('</body>');
  
  if (bodyCloseIndex === -1) {
    throw new Error('Could not find closing body tag');
  }

  const scriptTag = `<script type="module" src="${scriptSrc}"></script>`;
  
  const modifiedHtml = htmlString.slice(0, bodyCloseIndex) + 
                      scriptTag + 
                      htmlString.slice(bodyCloseIndex);
  
  return modifiedHtml;
}

// Helper function to determine if this is an HTML document request
function isHtmlDocumentRequest(request: Request, pathname: string): boolean {
  // Check for file extension in the path
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
  if (hasFileExtension) {
    // If there's a file extension, it should specifically be .html
    return pathname.endsWith('.html');
  }

  // Check the Accept header
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader) {
    // Check if HTML is accepted and preferred
    const acceptTypes = acceptHeader.split(',');
    const acceptsHtml = acceptTypes.some(type => 
      type.includes('text/html') || 
      type.includes('application/xhtml+xml') ||
      type.includes('*/*')
    );
    
    if (!acceptsHtml) {
      return false;
    }
  }

  // If no file extension and accepts HTML (or no Accept header),
  // check if this looks like a page route
  
  // Common non-HTML API patterns to exclude
  const apiPatterns = [
    '/api/',
    '/graphql',
    '/ws',
    '/_next/data/',  // Next.js data routes
    '/__data.json',  // Remix data routes
  ];
  
  if (apiPatterns.some(pattern => pathname.startsWith(pattern))) {
    return false;
  }

  // Static asset extensions to exclude
  const assetExtensions = [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.map',
    '.json',
  ];
  
  if (assetExtensions.some(ext => pathname.endsWith(ext))) {
    return false;
  }

  // If we get here, treat it as an HTML request
  return true;
}