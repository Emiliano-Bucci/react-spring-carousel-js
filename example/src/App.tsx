import React, { useContext } from 'react'
import {
  ReactSpringCarousel,
  ReactSpringCarouselContext
} from 'react-spring-carousel'

function Comp() {
  const { getIsActiveItem } = useContext(ReactSpringCarouselContext)
  console.log({
    isActiveItem: getIsActiveItem('item-2')
  })

  return <div>YOYOOO</div>
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
      <div
        style={{
          margin: 40,
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <ReactSpringCarousel
          withLoop
          items={[
            {
              id: 'item-1',
              renderItem: (
                <div
                  style={{
                    background: 'orange'
                  }}
                >
                  FIRST
                </div>
              )
            },
            {
              id: 'item-2',
              renderItem: <Comp />
            },
            { id: 'item-3', renderItem: <div>LAST</div> }
          ]}
        />
      </div>
    </div>
  )
}

export default App
