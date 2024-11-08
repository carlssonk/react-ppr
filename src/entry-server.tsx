/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassThrough, Stream, Writable } from 'node:stream'
// @ts-expect-error no types
import { resumeToPipeableStream, renderToPipeableStream } from 'react-dom/server.node'
// @ts-expect-error no types
import { prerender } from 'react-dom/static.edge'
// import { dehy } from '@tanstack/react-router';

// import { createRouter } from '../router'


import { createMemoryHistory, RouterProvider, createRouter as createTanStackRouter} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { APIGatewayProxyEvent, Handler } from 'aws-lambda'
import { StartServer } from '@tanstack/start/server'
import SuperJSON from 'superjson'
import { createRouter } from './router'

// Import all JSON files at build time
const pages = import.meta.glob('../prerender/*.json', { eager: true })

// Create a lookup object with all the JSON data
const jsonData: Record<string, any> = {}

// Process the imported modules
Object.entries(pages).forEach(([path, module]) => {
  // Extract the filename without extension from the path
  // e.g., '/src/data/about.json' becomes 'about'
  const key = path.match(/\/([^/]+)\.json$/)?.[1] || ''
  jsonData[key] = (module as { default: any }).default
})

// Function to get JSON data for a path
function getJsonForPath(path: string): any {
  // Remove leading slash and convert to filename
  const key = path.replace(/^\//, '') || 'home'
  
  if (key in jsonData) {
    return jsonData[key]
  }
  
  console.error(`JSON data not found for path: ${path}`)
  return null
}


declare const __BUILD_TARGET__: 'prerender' | 'client' |'server' | undefined

// Function to convert a Node.js pipeable stream into a Web ReadableStream
function toWebReadableStream(pipeableStream: Stream) {
  // Create a PassThrough stream to read data chunk by chunk
  const passthrough = new PassThrough()

  // Pipe the Node.js stream into the PassThrough stream
  pipeableStream.pipe(passthrough)

  return new ReadableStream({
    start(controller) {
      const reader = passthrough[Symbol.asyncIterator]()

      const pump = async () => {
        try {
          for await (const chunk of reader) {
            // Enqueue each chunk into the Web ReadableStream
            controller.enqueue(chunk)
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }

      pump()
    },
    cancel() {
      // Abort the Node.js stream when the web ReadableStream is canceled
      // @ts-expect-error no types / TODO: is there a way to do this without the expect error?
      pipeableStream.destroy()
      passthrough.destroy()
    },
  })
}

const headers = {
  'Content-Type': 'text/html; charset=utf-8',
  'Transfer-Encoding': 'chunked',
  // set caching header so it never caches
  'Cache-Control':
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
}

const streamToBuffer = async (stream: any) => {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}


const router = createRouter();
export const routeTreeChildren = router.routeTree.children


export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  const path = event.queryStringParameters?.path || '/'

  // if (IS_PRERENDER) {
  //   return new Promise((resolve, reject) => {
  //     let didError = false;
  //     let html = '';
  //     const postponed: Record<string, unknown> = {};
      
  //     const writable = new Writable({
  //       write(chunk, encoding, callback) {
  //         html += chunk;
  //         callback();
  //       }
  //     });

  //     writable.on('finish', () => {
  //       const dehydratedRouter = router.dehydrate()
        
  //       // Ensure we have valid initial data
  //       const initialMatchData = {
  //         __beforeLoadContext: SuperJSON.stringify({}),
  //         loaderData: SuperJSON.stringify({
  //           data: {} // Empty object instead of undefined
  //         }),
  //         extracted: {}
  //       };

  //       // const tsrInitScript = `
  //       //   <script>
  //       //     window.__TSR__ = {
  //       //       matches: [],
  //       //       initMatch: function(index) {
  //       //         if (this.matches[index]) {
  //       //           const matchData = this.matches[index];
  //       //           try {
  //       //             if (matchData.__beforeLoadContext) {
  //       //               matchData.__beforeLoadContext = SuperJSON.parse(matchData.__beforeLoadContext);
  //       //             }
  //       //             if (matchData.loaderData) {
  //       //               matchData.loaderData = SuperJSON.parse(matchData.loaderData);
  //       //             }
  //       //           } catch (e) {
  //       //             console.error('Error parsing match data:', e);
  //       //             // Provide fallback data if parsing fails
  //       //             matchData.__beforeLoadContext = {};
  //       //             matchData.loaderData = { data: {} };
  //       //           }
  //       //         }
  //       //       }
  //       //     };
  //       //     window.__TSR_INITIAL_STATE__ = ${SuperJSON.stringify(dehydratedRouter)};
  //       //   </script>
  //       // `;

  //       // // Combine the HTML with the scripts in the correct order
  //       // const finalHtml = `
  //       //   ${tsrInitScript}
  //       //   <div id="app">${html}</div>
  //       // `;

  //       resolve({
  //         prelude: html,
  //         postponed
  //       });
  //     });

  //     writable.on('error', (error) => {
  //       didError = true;
  //       reject(error);
  //     });

  //     const { pipe, abort } = renderToPipeableStream(
  //       <StartServer router={router} />,
  //       {
  //         onShellReady() {
  //           pipe(writable);
  //         },
  //         onShellError(error) {
  //           didError = true;
  //           reject(error);
  //         },
  //         onError(error) {
  //           didError = true;
  //           console.error(error);
  //         },
  //         onPostpone(reason) {
  //           postponed[reason] = true;
  //         }
  //       }
  //     );

  //     setImmediate(() => {
  //       if (!didError) {
  //         abort();
  //       }
  //     });
  //   });
  // }

  if (__BUILD_TARGET__ === 'prerender') {
    const memoryHistory = createMemoryHistory({
      initialEntries: [path],
    })

    const router = createTanStackRouter({
      routeTree: routeTree,
      history: memoryHistory,
    })

    await router.load()

    type Prerendered = {
      postponed: Record<string, unknown>;
      prelude: ReadableStream;
    };

    const controller = new AbortController()
    const prerendered = await new Promise<Prerendered>((resolve, reject) => {
      let result: Prerendered
      setImmediate(() => {
        try {
          result = prerender(<StartServer router={router} />, {
            signal: controller.signal,
          })
        } catch (error) {
          reject(error)
        }
      })
      setImmediate(() => {
        controller.abort()
        resolve(result)
      })
    })

    // prerendered.prelude is a ReadableStream, so we need to convert it to a string
    const prelude = await new Response(prerendered.prelude).text()

    return {
      prelude,
      postponed: prerendered.postponed
    }
  }

  const { postponed } = getJsonForPath(path)

  if (!postponed) {
    return {
      statusCode: 200,
      headers,
      isBase64Encoded: false,
      body: '',
    }
  }
  // const data = await import(`../prerender${path === "/" ? '/index' : path}.json`);


  const resumed = await resumeToPipeableStream(
    <RouterProvider router={router} />,
    postponed ? structuredClone(postponed): undefined,
  )

  const stream = toWebReadableStream(resumed)
  
  // Convert stream to buffer
  const buffer = await streamToBuffer(stream)

  return {
    statusCode: 200,
    headers,
    isBase64Encoded: false,
    body: buffer.toString('utf-8'),
  }
}