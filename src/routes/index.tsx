import { PropsWithChildren, Suspense, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  meta: () => [
    {
      title: 'React PPR',
    },
  ],
  component: HomeComponent,
})

interface StepProps extends PropsWithChildren {
  number: number
  className?: string
  status?: 'incomplete' | 'complete' | 'current'
}

const Step: React.FC<StepProps> = ({ number, children }) => {
  return (
    <li className="flex mb-2">
      <span className="font-medium min-w-[1.5rem] text-slate-600 mr-2">
        {number}.
      </span>
      <span>{children}</span>
    </li>
  )
}

function HomeComponent() {
  const [count, setCount] = useState(0)

  const [currentUrl, setCurrentUrl] = useState('')

  // TODO: maybe we can wrap window.location.href in the use() hook?
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  return (
    <div className="max-w-screen-sm p-2 text-sm">
      <h1 className="mb-2 text-2xl">Welcome Home!</h1>
      <p className="mb-2">
        This page was rendered using PPR (Partial Prerendering). It works by
        combining prerendered and dynamic components into a single HTTP request,
        eliminating initial waterfall requests for the dynamic content.
      </p>
      <p className="mb-2">
        During the build process, this route was prerendered to the fullest
        extent possible - the text you're reading now as well as the button is
        prerendered HTML.
      </p>
      <button
        onClick={() => setCount((count) => count + 1)}
        className="p-3 px-6 mb-2 text-white transition-colors border rounded-lg border-slate-800 bg-slate-950 hover:bg-black hover:border hover:border-slate-600 active:scale-[0.98]"
      >
        Count: {count}
      </button>
      <h2 className="mb-2 text-xl">PPR Flow</h2>
      <ol>
        <Step number={1}>
          User makes request to {currentUrl || 'loading...'}
        </Step>
        <Step number={2}>
          Request hits a Cloudflare Worker, prerendered HTML gets sent back
          instantly, at the same time the request gets forwarded to a Lambda
          function
        </Step>
        <Step number={3}>
          Browser receives the prerendered HTML and it gets displayed to the
          user
        </Step>
        <Step number={4}>
          Browser makes the necessary requests for static assets and JS for
          hydration, page gets repainted and the button gets hydrated
        </Step>
        <Step number={5}>
          Cloudflare Worker receives server rendered HTML from the lambda and
          streams it down to the browser
        </Step>
        <Step number={6}>
          Dynamic content gets injected to the HTML document, page repaints, and
          potential hydration happens
        </Step>
        <Step number={7}>Done</Step>
      </ol>
      <hr className="my-4" />
      <div>
        <h2 className="text-xl">Streamed dynamic content</h2>
      </div>
    </div>
  )
}
