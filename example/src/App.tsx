import React from 'react'
import { useReactSpringCarousel } from 'react-spring-carousel-js'

const App = () => {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem
  } = useReactSpringCarousel({
    withTumbs: false,
    items: [
      {
        id: 'item-1',
        renderItem: (
          <div
            style={{
              background: 'yellow',
              padding: 8
            }}
          >
            Item 1
          </div>
        )
      },
      {
        id: 'item-2',
        renderItem: (
          <div
            style={{
              background: 'yellow',
              padding: 8
            }}
          >
            Item 2
          </div>
        )
      }
    ]
  })

  return (
    <div
      style={{
        display: 'flex',
        padding: 24,
        background: 'orange'
      }}
    >
      <button onClick={slideToPrevItem}>PREV</button>
      <div style={{ margin: '0 32px', flex: 1 }}>{carouselFragment}</div>
      <button onClick={slideToNextItem}>NEXT</button>
    </div>
  )
}

export default App
