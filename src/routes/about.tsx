import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import CoolImg from "../assets/cool.jpg"


export const Route = createFileRoute('/about')({
  meta: () => [
    {
      title: 'React PPR - About',
    },
  ],
  component: AboutComponent,
})

function AboutComponent() {
  const [showImg, setShowImg] = useState(false)

  return (
    <div className="p-2">
      <h3>About</h3>
      <button onClick={() => setShowImg(true)}>
        Show Img
      </button>
      {
        showImg && (
          <img src={CoolImg} />
        )
      }
    </div>
  )
}
