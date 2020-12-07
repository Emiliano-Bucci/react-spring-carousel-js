import React, { useContext } from 'react'
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
const items2 = [
  {
    id: 'item-1a',
    renderItem: <div>Item 1a</div>
  },
  {
    id: 'item-2a',
    renderItem: <div>Item 2a</div>
  },
  {
    id: 'item-3a',
    renderItem: <div>Item 3a</div>
  }
]

const Car1 = () => {
  const { carouselFragment, thumbs } = useReactSpringCarousel({
    items: items1,
    withTumbs: false
  })

  return (
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
  )
}
const Car2 = () => {
  const { carouselFragment, thumbs } = useReactSpringCarousel({
    items: items2,
    withTumbs: false
  })

  return (
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
      <Car2 />
    </div>
  )
}

export default App
