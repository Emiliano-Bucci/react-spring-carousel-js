import React, { HTMLAttributes } from 'react'
import { useSpringCarousel } from 'react-spring-carousel-js'

const Item = ({
  children,
  ...rest
}: { children: React.ReactNode } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      style={{
        flex: 1,
        padding: '8x 24px',
        cursor: 'grab',
        userSelect: 'none',
        ...rest?.style
      }}
    >
      {children}
    </div>
  )
}

const App = () => {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem,
    slideToItem
  } = useSpringCarousel({
    withLoop: true,
    itemsPerSlide: 3,
    initialActiveItem: 1,
    items: [
      {
        id: 'item-1',
        renderItem: (
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 1
          </Item>
        ),
        renderThumb: (
          <div
            onClick={() => slideToItem('item-2')}
            style={{
              height: 100,
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
          <Item
            style={{
              background: 'yellow'
            }}
          >
            Item 2
          </Item>
        ),
        renderThumb: (
          <div
            style={{
              height: 100,
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
          <Item
            style={{
              background: 'green'
            }}
          >
            Item 3
          </Item>
        ),
        renderThumb: (
          <div
            style={{
              height: 100,
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
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 4
          </Item>
        ),
        renderThumb: (
          <div
            onClick={() => slideToItem('item-2')}
            style={{
              height: 100,
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
          <Item
            style={{
              background: 'black'
            }}
          >
            Item 5
          </Item>
        ),
        renderThumb: (
          <div
            style={{
              height: 100,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 5
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
          display: 'flex',
          width: '100%',
          height: 500,
          overflow: 'hidden'
        }}
      >
        <div style={{ margin: '0 32px', flex: 1 }}>{carouselFragment}</div>
      </div>
      <button onClick={slideToNextItem}>NEXT</button>
    </div>
  )
}

export default App
