import styled from '@emotion/styled'
import React from 'react'
import { useSpringCarousel } from 'react-spring-carousel-js'

const Item = styled.div`
  flex: 1;
  padding: 8px 24px;

  :not(:last-of-type) {
    margin-right: 32px;
  }

  cursor: grab;
  user-select: none;
`

const App = () => {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem,
    slideToItem
  } = useSpringCarousel({
    withLoop: true,
    itemsPerSlide: 4,
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
              background: 'yellow'
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
      },
      {
        id: 'item-3a',
        renderItem: (
          <Item
            style={{
              background: 'green'
            }}
          >
            Item 6
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
            THUMB 6
          </div>
        )
      },
      {
        id: 'item-1s',
        renderItem: (
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 7
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
            THUMB 7
          </div>
        )
      },
      {
        id: 'item-2s',
        renderItem: (
          <Item
            style={{
              background: 'yellow'
            }}
          >
            Item 8
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
            THUMB 8
          </div>
        )
      },
      {
        id: 'item-3s',
        renderItem: (
          <Item
            style={{
              background: 'green'
            }}
          >
            Item 9
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
            THUMB 9
          </div>
        )
      },
      {
        id: 'item-1d',
        renderItem: (
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 10
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
            THUMB 10
          </div>
        )
      },
      {
        id: 'item-2d',
        renderItem: (
          <Item
            style={{
              background: 'yellow'
            }}
          >
            Item 11
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
            THUMB 11
          </div>
        )
      },
      {
        id: 'item-3d',
        renderItem: (
          <Item
            style={{
              background: 'green'
            }}
          >
            Item 12
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
            THUMB 12
          </div>
        )
      },
      {
        id: 'item-1q',
        renderItem: (
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 13
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
            THUMB 13
          </div>
        )
      },
      {
        id: 'item-2q',
        renderItem: (
          <Item
            style={{
              background: 'yellow'
            }}
          >
            Item 14
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
            THUMB 14
          </div>
        )
      },
      {
        id: 'item-3q',
        renderItem: (
          <Item
            style={{
              background: 'green'
            }}
          >
            Item 15
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
