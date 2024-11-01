// import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import GithubLogo from '../assets/github-mark-white.svg'

// export const Route = createRootRoute({
//   loader: () => {
//     // Return an empty object instead of undefined
//     return {
//       data: {}
//     }
//   },
//   component: RootComponent,
// })

// function RootComponent() {
//   return (
//       <div className="flex flex-col items-center justify-center w-full text-slate-200">
//         <h1>My Router APP</h1>
//          <div className="relative flex w-full">
//           <a className="absolute top-0 flex h-full right-32" href='https://google.com' target='_blank'>Source<img src={GithubLogo} alt="Logo" /></a>
//           <div className="flex items-center justify-center w-full border-b">
//             <div className="flex gap-3 p-2 text-lg">
//               <Link
//                 to="/"
//                 activeProps={{
//                   className: 'font-bold',
//                 }}
//                 activeOptions={{ exact: true }}
//               >
//             Home
//               </Link>{' '}
//               <Link
//                 to="/about"
//                 activeProps={{
//                   className: 'font-bold',
//                 }}
//               >
//             About
//               </Link>
//             </div>
//           </div>
//         </div>
//         <div className="h-4"></div>
//         {/* <Outlet /> */}
//         {/* <TanStackRouterDevtools position="bottom-right" /> */}
//       </div>
//   )
// }

// app/routes/__root.tsx
import {
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'TanStack Start Starter',
    },
  ],
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}