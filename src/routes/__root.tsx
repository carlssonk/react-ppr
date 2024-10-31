import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import GithubLogo from '../assets/github-mark-white.svg'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
      <div className="flex flex-col items-center justify-center w-full text-slate-200">
        <div className="relative flex w-full">
          <a className="absolute top-0 flex h-full right-32" href='https://google.com' target='_blank'>Source<img src={GithubLogo} alt="Logo" /></a>
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
        <TanStackRouterDevtools position="bottom-right" />
      </div>
  )
}
