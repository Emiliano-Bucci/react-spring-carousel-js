import React from 'react'
import { useReactSpringCarousel } from 'react-spring-carousel-js'

const App = () => {
  const {
    carouselFragment,
    thumbsFragment,
    slideToPrevItem,
    slideToNextItem
  } = useReactSpringCarousel({
    items: [
      {
        id: 'item-1',
        renderItem: (
          <div
            style={{
              background: 'red',
              padding: 8
            }}
          >
            Item 1
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 1
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
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 2
          </div>
        )
      },
      {
        id: 'item-3',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: '8px 16px'
            }}
          >
            Item 2
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 3
          </div>
        )
      },
      {
        id: 'item-4',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: 8
            }}
          >
            Item 2
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 4
          </div>
        )
      },
      {
        id: 'item-5',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: 8
            }}
          >
            Item 5
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 5
          </div>
        )
      },
      {
        id: 'item-6',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: 8
            }}
          >
            Item 6
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 6
          </div>
        )
      },
      {
        id: 'item-7',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: 8
            }}
          >
            Item 7
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 20,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 7
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
      <div
        style={{
          width: '100%',
          display: 'grid'
        }}
      >
        <div style={{ margin: '0 32px', flex: 1 }}>{carouselFragment}</div>
        <div
          style={{
            maxWidth: '100px',
            background: 'brown'
          }}
        >
          {thumbsFragment}
        </div>
      </div>
      <button onClick={slideToNextItem}>NEXT</button>
    </div>
  )
}

export default App
