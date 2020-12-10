import React, { useContext } from 'react'
import {
  RCSJSOnDrag,
  ReactSpringCarouselContext,
  ReactSpringCustomEvents,
  useReactSpringCarousel
} from 'react-spring-carousel-js'

function Comp() {
  const { useListenToCustomEvent } = useContext(ReactSpringCarouselContext)

  useListenToCustomEvent<RCSJSOnDrag>(
    ReactSpringCustomEvents['RCSJS:onDrag'],
    () => {}
  )

  return <div>Item 1</div>
}

const App = () => {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem
  } = useReactSpringCarousel({
    withTumbs: false,
    slideAxis: 'y',
    items: [
      {
        id: 'item-1',
        renderItem: <Comp />
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
