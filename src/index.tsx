import React, { useState } from 'react'
import { useSpring } from 'react-spring'
import { Wrapper, CarouselWrapper, CarouselItemWrapper } from './index.styles'

interface Item {
  id: string
  renderItem: React.ReactNode
}

interface Props<T extends Item> {
  items: T[]
}

export function ReactSpringCarousel<T extends Item>({ items }: Props<T>) {
  const [activeItem, setActiveItem] = useState(0)
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    x: 0
  }))

  console.log({
    activeItem,
    setActiveItem
  })

  function handleSlideToNextItem() {
    setCarouselStyles({
      x: 1
    })
  }

  return (
    <Wrapper>
      <div
        style={{
          position: 'relative',
          background: 'blue',
          zIndex: 100
        }}
      >
        prev item
      </div>
      <CarouselWrapper
        style={{
          transform: carouselStyles.x.to(
            (value) => `translateX(${value * 100}%)`
          )
        }}
      >
        {items.map(({ id, renderItem }) => (
          <CarouselItemWrapper key={id}>{renderItem}</CarouselItemWrapper>
        ))}
      </CarouselWrapper>
      <div
        style={{
          position: 'relative',
          background: 'blue',
          zIndex: 100
        }}
        onClick={handleSlideToNextItem}
      >
        next item
      </div>
    </Wrapper>
  )
}
