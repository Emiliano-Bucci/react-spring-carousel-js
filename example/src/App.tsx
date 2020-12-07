import React from 'react'
import { useReactSpringCarousel } from 'react-spring-carousel'

function Comp() {
  return <div>asdsadasd</div>
}

const items = [
  {
    id: 'item-1',
    renderItem: <Comp />
  },
  {
    id: 'item-1a',
    renderItem: (
      <div
        style={{
          background: 'brown'
        }}
      >
        FIRST
      </div>
    )
  },
  {
    id: 'item-1b',
    renderItem: (
      <div
        style={{
          background: 'orange'
        }}
      >
        FIRST
      </div>
    )
  },
  {
    id: 'item-2',
    renderItem: <div>YOYOYO</div>
  },
  {
    id: 'item-3',
    renderItem: <div>LAST</div>
  },
  {
    id: 'item-22',
    renderItem: <div>YOYOYOqwe</div>
  },
  {
    id: 'item-3a',
    renderItem: <div>LASTa</div>
  }
]

const App = () => {
  const { carouselFragment, thumbs } = useReactSpringCarousel({
    items,
    withTumbs: false
  })

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#eee'
      }}
    >
      <div
        style={{
          margin: 40,
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <div
          style={{
            maxWidth: 600
          }}
        >
          {carouselFragment}
          {thumbs}
        </div>
      </div>
    </div>
  )
}

export default App
