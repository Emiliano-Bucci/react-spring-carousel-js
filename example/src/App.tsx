/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { HTMLAttributes, useState } from 'react'
import {
  useSpringCarousel,
  useSpringCarouselContext
} from 'react-spring-carousel-js'

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
  id,
  ...rest
}) => {
  const { useListenToCustomEvent, getIsActiveItem } = useSpringCarouselContext()
  const [isActive, setIsActive] = useState(false)

  useListenToCustomEvent((data) => {
    if (data.eventName === 'onSlideStartChange') {
      if (getIsActiveItem(id!) && !isActive) {
        setIsActive(true)
        console.log('set true')
      }

      if (!getIsActiveItem(id!) && isActive) {
        setIsActive(false)
        console.log('set false')
      }
    }
  })

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
      {/* {isActive && <span>IS ACTIVE!</span>} */}
    </div>
  )
}

const App = () => {
  const { carouselFragment, slideToNextItem } = useSpringCarousel({
    withLoop: true,
    items: items.map((item) => ({
      id: item.id,
      renderItem: (
        <Item key={item.id} css={item.style} id={item.id}>
          {item.label}
        </Item>
      )
    }))
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
      <button onClick={slideToNextItem}>NEXT ITEM</button>
    </div>
  )
}

export default App
