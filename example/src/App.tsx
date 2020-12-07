import React from 'react'
import { useReactSpringCarousel } from 'react-spring-carousel'

const CustomThumbsWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => <div>{children}</div>

const items = [
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
    ),
    renderThumb: <div>Thumb FIRST</div>
  },
  {
    id: 'item-1a',
    renderItem: (
      <div
        style={{
          background: 'brown'
        }}
      >
        FIRST
      </div>
    ),
    renderThumb: <div>Thumb FIRST</div>
  },
  {
    id: 'item-1b',
    renderItem: (
      <div
        style={{
          background: 'orange'
        }}
      >
        FIRST
      </div>
    ),
    renderThumb: <div>Thumb FIRST</div>
  },
  {
    id: 'item-2',
    renderItem: <div>YOYOYO</div>,
    renderThumb: <div>Thumb YOYOYO</div>
  },
  {
    id: 'item-3',
    renderItem: <div>LAST</div>,
    renderThumb: <div>Thumb LAST</div>
  },
  {
    id: 'item-22',
    renderItem: <div>YOYOYOqwe</div>,
    renderThumb: <div>Thumb YOYOYO12312</div>
  },
  {
    id: 'item-3a',
    renderItem: <div>LASTa</div>,
    renderThumb: <div>Thumb LAST</div>
  }
]

const App = () => {
  const { reactSpringCarouselFragment, thumbs } = useReactSpringCarousel({
    items,
    withLoop: false,
    CustomThumbsWrapper
  })

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
        {reactSpringCarouselFragment}
        {thumbs}
      </div>
    </div>
  )
}

export default App
