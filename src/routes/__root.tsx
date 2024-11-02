import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRoute,
} from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import GithubLogo from "../assets/github-mark-white.svg"
import CoolImg from "../assets/cool.jpg"

declare const __BUILD_TARGET__: string | undefined
declare const __VITE_MANIFEST__: boolean | undefined

export const Route = createRootRoute({
  ...(__BUILD_TARGET__ === 'prerender' && __VITE_MANIFEST__ && {
    meta: () => [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'LOL TanStack Start Starter',
      },
    ],
    links: () => [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href: __VITE_MANIFEST__['src/client.tsx'].css,
      },
    ],
    scripts: () => [
      {
        type: "module",
        src: __VITE_MANIFEST__['src/client.tsx'].file
      }
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
             <div className="flex flex-col items-center justify-center w-full text-slate-200">
        <div className="relative flex w-full">
          <a className="absolute top-0 flex h-full right-32" href='https://google.com' target='_blank'>Source<img src={GithubLogo} alt="Logo" /></a>
          <a className="absolute top-0 flex h-full right-32" href='https://google.com' target='_blank'>Cool<img src={CoolImg} alt="Logo" /></a>
          <div className="flex items-center justify-center w-full border-b">
            <div className="flex gap-3 p-2 text-lg">
              <Link
                to="/"
                activeProps={{
                  className: 'font-bold',
                }}
                activeOptions={{ exact: true }}
              >
            Home
              </Link>{' '}
              <Link
                to="/about"
                activeProps={{
                  className: 'font-bold',
                }}
              >
            About
              </Link>
            </div>
          </div> 
        </div>
        <div className="h-4"></div> 
      <Outlet />
      </div>
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
// import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// import GithubLogo from '../assets/github-mark-white.svg'

// export const Route = createRootRoute({
//   component: RootComponent,
// })

// function RootComponent() {
//   return (
//       <div className="flex flex-col items-center justify-center w-full text-slate-200">
//         <div className="relative flex w-full">
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
//         <Outlet />
//         <TanStackRouterDevtools position="bottom-right" />
//       </div>
//   )
// }