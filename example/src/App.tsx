import React, { HTMLAttributes, useState } from 'react'
import { useSpringCarousel } from 'react-spring-carousel-js'

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
  const [ok, setOk] = useState(true)
  const { carouselFragment } = useSpringCarousel({
    withLoop: true,
    disableGestures: ok,
    items: items.map((item) => ({
      id: item.id,
      renderItem: (
        <Item key={item.id} style={item.style}>
          {item.label}
        </Item>
      )
    }))
  })

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <div style={{ flex: 1 }}>{carouselFragment}</div>
      <button onClick={() => setOk((p) => !p)}>TOGGLE</button>
    </div>
  )
}

export default App
