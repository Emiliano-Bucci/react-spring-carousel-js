import React from 'react'
import { ReactSpringCarousel } from 'react-spring-carousel'

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
              renderItem: (
                <div
                  style={{
                    background: 'yellow'
                  }}
                >
                  Item 2
                </div>
              )
            },
            { id: 'item-3', renderItem: <div>LAST</div> }
          ]}
        />
      </div>
    </div>
  )
}

export default App
