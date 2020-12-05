import React from 'react'
import { ReactSpringCarousel } from 'react-spring-carousel'

const App = () => {
  return (
    <ReactSpringCarousel
      items={[{ id: 'item-1', renderItem: <div>asdsa</div> }]}
    />
  )
}

export default App
