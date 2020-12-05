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
            { id: 'item-1', renderItem: <div>Item 1</div> },
            { id: 'item-2', renderItem: <div>Item 2</div> },
            { id: 'item-3', renderItem: <div>Item 3</div> }
          ]}
        />
      </div>
    </div>
  )
}

export default App
