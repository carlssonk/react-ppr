import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-2">
      <h3>About</h3>
      <button onClick={() => setCount(count => count + 1)}>Count: {count}</button>
    </div>
  )
}
