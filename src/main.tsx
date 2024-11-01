// /// <reference types="vite-plugin-svgr/client" />
// // if (typeof document !== 'undefined') {
// //   import('./index.css')
// // }
// import ReactDOM from 'react-dom/client'
// import { RouterProvider, createRouter } from '@tanstack/react-router'
// import { routeTree } from './routeTree.gen'
// import { SuperJSON } from 'superjson'

// // import { initializeApp } from './hydration-handler'

// // Set up a Router instance
// const router = createRouter({
//   routeTree,
//   defaultPreload: 'intent',
//   transformer: SuperJSON,
// })

// // Register things for typesafety
// declare module '@tanstack/react-router' {
//   interface Register {
//     router: typeof router
//   }
// }

// // initializeApp(router);

// // Wait for the document to be ready
// if (typeof document !== 'undefined') {
//   const rootElement = document.getElementById('app')!
//   const root = ReactDOM.createRoot(rootElement)
//   root.render(<RouterProvider router={router} />)
// }

// // // if (typeof document !== 'undefined') {
// //   const rootElement = document.getElementById('app')!
// //   ReactDOM.hydrateRoot(rootElement, <RouterProvider router={router} />)
// // // }


// export const routeTreeChildren = router.routeTree.children