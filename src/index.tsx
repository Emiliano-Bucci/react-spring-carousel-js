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
    const currentSlidedValue = -(getCarouselWrapperWidth() * activeItem)

    if (dragging) {
      setCarouselStyles({ x: currentSlidedValue + mx })
    }

    if (last) {
      const prevItemTreshold = mx > 50
      const nextItemTreshold = mx < -50

      if (nextItemTreshold) {
        const isLastItem = activeItem === internalItems.length - 1

        if (!withLoop && isLastItem) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          handleSlideToNextItem()
        }
      } else if (prevItemTreshold) {
        const isFirstItem = activeItem === 0

        if (!withLoop && isFirstItem) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          handleSlideToPrevItem()
        }
      } else {
        setCarouselStyles({ x: currentSlidedValue })
      }
    }
  })

  function getPrevItem() {
    return activeItem - 1
  }

  function getNextItem() {
    return activeItem + 1
  }

  function getCarouselWrapperWidth() {
    if (!carouselWrapperRef.current) {
      return 0
    }

    return carouselWrapperRef.current.getBoundingClientRect().width
  }

  function handleSlideToPrevItem() {
    const isFirstItem = activeItem === 0

    function slideToPrevItem() {
      const prevItem = getPrevItem()

      setActiveItem(prevItem)
      setCarouselStyles({
        x: -(getCarouselWrapperWidth() * prevItem)
      })
    }

    if (!withLoop) {
      if (isFirstItem) {
        return false
      }

      slideToPrevItem()

      return
    }

    if (isFirstItem) {
      const oppositeLastItemIndex = internalItems.length - 2

      setCarouselStyles({
        x: -(getCarouselWrapperWidth() * oppositeLastItemIndex),
        immediate: true,
        onRest: () => {
          const prevItem = internalItems.length - 3

          setActiveItem(prevItem)
          setCarouselStyles({ x: -(getCarouselWrapperWidth() * prevItem) })
        }
      })
    } else {
      slideToPrevItem()
    }

    return true
  }

  function handleSlideToNextItem() {
    function slideToNextItem() {
      const nextItem = getNextItem()

      setActiveItem(nextItem)
      setCarouselStyles({
        x: -(getCarouselWrapperWidth() * nextItem)
      })
    }

    if (!withLoop) {
      const isLastItem = activeItem === internalItems.length - 1

      if (isLastItem) {
        return false
      }

      slideToNextItem()

      return
    }

    const isLastItem = activeItem === internalItems.length - 2

    if (isLastItem) {
      setCarouselStyles({
        x: -(getCarouselWrapperWidth() * 0),
        immediate: true,
        onRest: () => {
          const nextItem = 1

          setActiveItem(nextItem)
          setCarouselStyles({ x: -(getCarouselWrapperWidth() * nextItem) })
        }
      })
    } else {
      slideToNextItem()
    }

    return true
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
        style={carouselStyles}
        ref={(ref) => {
          if (ref) {
            carouselWrapperRef.current = ref

            if (withLoop) {
              ref.style.left = `-${ref.getBoundingClientRect().width}px`
            }
          }
        }}
      >
        {internalItems.map(({ id, renderItem }, index) => (
          <CarouselItemWrapper key={`${id}-${index}`}>
            {renderItem}
          </CarouselItemWrapper>
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
