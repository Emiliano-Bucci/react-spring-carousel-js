/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { HTMLAttributes } from 'react'
import { useSpringCarousel } from 'react-spring-carousel-js'

const items = [
  {
    id: 'item-1',
    label: 'Item 1',
    style: css`
      background-color: red;
    `
  },
  {
    id: 'item-2',
    label: 'Item 2',
    style: css`
      background-color: purple;
    `
  },
  {
    id: 'item-3',
    label: 'Item 3',
    style: css`
      background-color: green;
    `
  },
  {
    id: 'item-4',
    label: 'Item 4',
    style: css`
      background-color: blue;
    `
  }
]

const Item: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        color: #fff;
        flex: 1;
        cursor: grab;
        user-select: none;
      `}
      {...rest}
    >
      {children}
    </div>
  )
}

const App = () => {
  const {
    carouselFragment,
    useListenToCustomEvent,
    enterFullscreen
  } = useSpringCarousel({
    withLoop: true,
    items: items.map((item) => ({
      id: item.id,
      renderItem: (
        <Item key={item.id} css={item.style}>
          {item.label}
        </Item>
      )
    }))
  })

  useListenToCustomEvent((data) => {
    if (data.eventName === 'onFullscreenChange') {
      console.log(data.isFullscreen)
    }
  })

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      `}
    >
      <div
        css={css`
          padding: 164px;
          flex: 1;
        `}
      >
        {carouselFragment}
      </div>
      <button onClick={() => enterFullscreen()}>ENTER FULLSCREEN</button>
    </div>
  )
}

export default App
