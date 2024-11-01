/// <reference types="vite-plugin-svgr/client" />
// if (typeof document !== 'undefined') {
//   import('./index.css')
// }
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { StartClient } from '@tanstack/start'
import SuperJSON from 'superjson'

// import { initializeApp } from './hydration-handler'

// Set up a Router instance
const router = createRouter({
  routeTree,
  // defaultPreload: 'intent',
  // transformer: SuperJSON,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// router.hydrate();

const rootElement = document.getElementById('app')!
// ReactDOM.hydrateRoot(rootElement, <h1>My APP</h1>)
ReactDOM.hydrateRoot(rootElement, <StartClient router={router} />)