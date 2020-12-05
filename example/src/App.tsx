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
          items={[{ id: 'item-1', renderItem: <div>asdsa</div> }]}
        />
      </div>
    </div>
  )
}

export default App
