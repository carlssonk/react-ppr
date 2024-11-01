/// <reference types="vite-plugin-svgr/client" />
if (typeof document !== 'undefined') {
  import('./index.css')
}
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('app')!

  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(<RouterProvider router={router} />)
  }
}

export const routeTreeChildren = router.routeTree.children