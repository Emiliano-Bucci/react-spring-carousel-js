import React from 'react'
import { useSpringCarousel } from 'react-spring-carousel-js'

const App = () => {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem,
    thumbsFragment,
    slideToItem
  } = useSpringCarousel({
    withThumbs: true,
    withLoop: true,
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
            onClick={() => slideToItem('item-2')}
            style={{
              height: 200,
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
              height: 200,
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
            Item 3
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 200,
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
        id: 'item-1a',
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
            onClick={() => slideToItem('item-2')}
            style={{
              height: 200,
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
        id: 'item-2a',
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
              height: 200,
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
        id: 'item-3a',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: '8px 16px'
            }}
          >
            Item 3
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 200,
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
        id: 'item-1s',
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
            onClick={() => slideToItem('item-2')}
            style={{
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 7
          </div>
        )
      },
      {
        id: 'item-2s',
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
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 8
          </div>
        )
      },
      {
        id: 'item-3s',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: '8px 16px'
            }}
          >
            Item 3
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 9
          </div>
        )
      },
      {
        id: 'item-1d',
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
            onClick={() => slideToItem('item-2')}
            style={{
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 10
          </div>
        )
      },
      {
        id: 'item-2d',
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
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 11
          </div>
        )
      },
      {
        id: 'item-3d',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: '8px 16px'
            }}
          >
            Item 3
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 12
          </div>
        )
      },
      {
        id: 'item-1q',
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
            onClick={() => slideToItem('item-2')}
            style={{
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 13
          </div>
        )
      },
      {
        id: 'item-2q',
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
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 14
          </div>
        )
      },
      {
        id: 'item-3q',
        renderItem: (
          <div
            style={{
              background: 'green',
              padding: '8px 16px'
            }}
          >
            Item 3
          </div>
        ),
        renderThumb: (
          <div
            style={{
              height: 200,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 15
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
          height: 500,
          overflow: 'hidden'
        }}
      >
        <div style={{ margin: '0 32px', flex: 1 }}>{carouselFragment}</div>

        {thumbsFragment}
      </div>
      <button onClick={slideToNextItem}>NEXT</button>
    </div>
  )
}

export default App
