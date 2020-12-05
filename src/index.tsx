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

  function getPrevItem() {
    return activeItem - 1
  }

  function getNextItem() {
    return activeItem + 1
  }

  function handleSlideToPrevItem() {
    const prevItem = getPrevItem()

    setActiveItem(prevItem)
    setCarouselStyles({
      x: prevItem
    })
  }

  function handleSlideToNextItem() {
    const nextItem = getNextItem()

    setActiveItem(nextItem)
    setCarouselStyles({
      x: nextItem
    })
  }

  return (
    <Wrapper>
      <div
        onClick={handleSlideToPrevItem}
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
