import React from 'react'
import { useReactSpringCarousel } from 'react-spring-carousel'

const items = [
  {
    id: 'item-1',
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
  { id: 'item-3', renderItem: <div>LAST</div> }
]

const App = () => {
  const { reactSpringCarouselFragment } = useReactSpringCarousel({
    items,
    withLoop: false
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
        {reactSpringCarouselFragment}
      </div>
    </div>
  )
}

export default App
