import React, { HTMLAttributes, useState } from 'react'
import { OnSlideStartChange, useSpringCarousel } from 'react-spring-carousel-js'

const items = [
  {
    id: 'item-1',
    label: 'Item 1',
    style: {
      background: 'red'
    }
  },
  {
    id: 'item-2',
    label: 'Item 2',
    style: {
      background: 'purple'
    }
  },
  {
    id: 'item-3',
    label: 'Item 3',
    style: {
      background: 'green'
    }
  },
  {
    id: 'item-4',
    label: 'Item 4',
    style: {
      background: 'blue'
    }
  }
]

const Item: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
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
  const [, setActiveItem] = useState(0)
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem,
    // slideToItem,
    useListenToCustomEvent,
    enterFullscreen
  } = useSpringCarousel({
    withLoop: true,
    items: items.map((item) => ({
      id: item.id,
      renderItem: (
        <Item key={item.id} style={item.style}>
          {item.label}
        </Item>
      )
    }))
  })

  useListenToCustomEvent<OnSlideStartChange>('onSlideStartChange', (data) => {
    console.log('onSlideStartChange', data)
    setActiveItem(data.nextItem)
  })
  useListenToCustomEvent('onSlideChange', (data) => {
    console.log('onDrag', data)
  })

  return (
    <div
      style={{
        display: 'flex',
        padding: 24,
        background: 'orange',
        touchAction: 'none'
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
        <div style={{ flex: 1 }}>{carouselFragment}</div>
      </div>
      <button onClick={slideToNextItem}>NEXT</button>
      <button onClick={() => enterFullscreen()}>fullscreen</button>
    </div>
  )
}

export default App
