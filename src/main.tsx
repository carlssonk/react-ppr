import { createRoot } from 'react-dom/client'
import { createRouter } from './router'
import { StrictMode } from 'react'
import { RouterProvider } from '@tanstack/react-router'

const router = createRouter()

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}