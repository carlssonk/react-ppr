import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { StartClient } from '@tanstack/start'
import { createRouter } from './router'
import "./main.css"

declare const __DEV__: boolean | undefined
const router = createRouter()

const rootElement = document.getElementById('root')!

if (__DEV__) {
  if (!rootElement.innerHTML) {
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    )
  }
} else {
  if (!rootElement) {
    throw new Error('Root element not found')
  }
  hydrateRoot(rootElement, <StartClient router={router} />)
}

