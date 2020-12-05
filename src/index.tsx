import React, { useState, useRef } from 'react'
import { useSpring } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { Wrapper, CarouselWrapper, CarouselItemWrapper } from './index.styles'

interface Item {
  id: string
  renderItem: React.ReactNode
}

interface Props<T extends Item> {
  withLoop?: boolean
  items: T[]
}

export function ReactSpringCarousel<T extends Item>({
  items,
  withLoop = false
}: Props<T>) {
  const internalItems = withLoop
    ? [items[items.length - 1], ...items, items[0]]
    : items
  const [activeItem, setActiveItem] = useState(0)
  const carouselWrapperRef = useRef<HTMLDivElement | null>(null)

  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    x: 0
  }))
  const bindDrag = useDrag(({ dragging, last, movement: [mx] }) => {
    const currentSlidedValue = getCarouselWrapperWidth() * activeItem

    if (dragging) {
      setCarouselStyles({ x: currentSlidedValue + mx })
    }

    if (last) {
      const prevItemTreshold = mx > 50
      const nextItemTreshold = mx < -50

      if (nextItemTreshold) {
        if (!withLoop) {
          const isLastItem = +activeItem === -(internalItems.length - 1)

          if (isLastItem) {
            setCarouselStyles({ x: currentSlidedValue })
          } else {
            handleSlideToNextItem()
          }
        }
      } else if (prevItemTreshold) {
        if (!withLoop) {
          const isFirstItem = activeItem === 0

          if (isFirstItem) {
            setCarouselStyles({ x: currentSlidedValue })
          } else {
            handleSlideToPrevItem()
          }
        }
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
    if (!withLoop && activeItem === 0) {
      return false
    }

    const prevItem = getPrevItem()

    setActiveItem(prevItem)
    setCarouselStyles({
      x: getCarouselWrapperWidth() * prevItem
    })

    return true
  }

  function handleSlideToNextItem() {
    if (!withLoop && activeItem === -(internalItems.length - 1)) {
      return false
    }

    const nextItem = getNextItem()

    setActiveItem(nextItem)
    setCarouselStyles({
      x: getCarouselWrapperWidth() * nextItem
    })

    return true
  }

  console.log({ carouselItems: internalItems })

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
        {internalItems.map(({ id, renderItem }) => (
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
