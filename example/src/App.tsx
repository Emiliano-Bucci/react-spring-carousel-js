import React, { useContext, useRef } from 'react'
import {
  ReactSpringCarouselContext,
  useReactSpringCarousel
} from 'react-spring-carousel-js'

function Comp1() {
  const { activeItem, slideToItem } = useContext(ReactSpringCarouselContext)

  console.log({ activeItem })

  return <div onClick={() => slideToItem(1)}>asdsadasd</div>
}

const items1 = [
  {
    id: 'item-1',
    renderItem: <Comp1 />
  },
  {
    id: 'item-2',
    renderItem: <div>Item 2</div>
  },
  {
    id: 'item-3',
    renderItem: <div>Item 3</div>
  }
]

const Car1 = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { carouselFragment, enterFullscreen } = useReactSpringCarousel({
    items: items1,
    withTumbs: false
  })

  return (
    <div
      style={{
        margin: 40,
        backgroundColor: 'red',
        flex: 1
      }}
    >
      <div
        style={{
          maxWidth: 600
        }}
      >
        {carouselFragment}
      </div>

      <div
        ref={ref}
        onClick={() => enterFullscreen(ref.current!)}
        style={{
          background: 'yellow'
        }}
      >
        adqwqe
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#eee'
      }}
    >
      <Car1 />
    </div>
  )
}

export default App
