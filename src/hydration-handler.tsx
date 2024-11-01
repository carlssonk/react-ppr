// // import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { RouterProvider } from '@tanstack/react-router'
// import { useState, useEffect } from 'react';

// // import { routeTree } from './routeTree.gen'

// // // Set up a Router instance
// // const router = createRouter({
// //   routeTree,
// //   defaultPreload: 'intent',
// // })

// // // Register things for typesafety
// // declare module '@tanstack/react-router' {
// //   interface Register {
// //     router: typeof router
// //   }
// // }

// // Create a wrapper component to handle hydration
// function HydrationHandler({ children }) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Return null on first render to avoid hydration mismatch
//   if (!isClient) {
//     return null;
//   }

//   return children;
// }

// // Main app initialization
// function initializeApp(router) {
//   if (typeof document !== 'undefined') {
//     const rootElement = document.getElementById('app');
    
//     if (!rootElement) {
//       console.error('Root element not found');
//       return;
//     }

//     // Check if this is a SSR environment with existing content
//     if (rootElement.hasChildNodes()) {
//       // Use hydrateRoot for SSR
//       ReactDOM.hydrateRoot(
//         rootElement,
//         <HydrationHandler>
//           <RouterProvider router={router} />
//         </HydrationHandler>
//       );
//     } else {
//       // Use createRoot for client-only rendering
//       const root = ReactDOM.createRoot(rootElement);
//       root.render(
//         <HydrationHandler>
//           <RouterProvider router={router} />
//         </HydrationHandler>
//       );
//     }
//   }
// }

// export { initializeApp };