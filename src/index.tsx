import React, { useState, useRef } from 'react'
import { useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
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
  const carouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselIsSliding = useRef(false)
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    x: 0
  }))
  const bindDrag = useDrag(({ dragging, last, movement: [mx], cancel }) => {
    if (carouselIsSliding.current) {
      cancel()
      return
    }

    const currentSlidedValue = getCarouselWrapperWidth() * activeItem

    if (dragging) {
      setCarouselStyles({ x: currentSlidedValue + mx })
    }

    if (last) {
      console.log(mx)
      const prevItemTreshold = mx > 50
      const nextItemTreshold = mx < -50

      if (nextItemTreshold) {
        handleSlideToNextItem()
        console.log('here')
      } else if (prevItemTreshold) {
        handleSlideToPrevItem()
      } else {
        setCarouselStyles({ x: currentSlidedValue })
      }
    }
  })

  function getPrevItem() {
    return activeItem + 1
  }

  function getNextItem() {
    return activeItem - 1
  }

  function getCarouselWrapperWidth() {
    return Number(carouselWrapperRef.current?.getBoundingClientRect().width)
  }

  function handleSlideToPrevItem() {
    const prevItem = getPrevItem()

    setActiveItem(prevItem)
    setCarouselStyles({
      x: getCarouselWrapperWidth() * prevItem
    })
  }

  function handleSlideToNextItem() {
    const nextItem = getNextItem()

    setActiveItem(nextItem)
    setCarouselStyles({
      x: getCarouselWrapperWidth() * nextItem
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
        {...bindDrag()}
        ref={carouselWrapperRef}
        style={carouselStyles}
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
