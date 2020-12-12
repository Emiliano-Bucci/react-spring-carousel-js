import React, { useRef, useState } from 'react'
import {
  useTransition,
  SpringConfig,
  animated,
  config,
  TransitionFrom,
  TransitionTo
} from 'react-spring'
import { ReactSpringCarouselItem } from '../types'

type SpringAnimationProps<Item> = {
  from: TransitionFrom<Item>
  enter: TransitionTo<Item>
  leave: TransitionTo<Item>
}

type FadingCarouselProps<T extends ReactSpringCarouselItem> = {
  items: T[]
  withThumbs?: boolean
  springConfig?: SpringConfig
  springAnimationPops?: SpringAnimationProps<T>
  withLoop?: boolean
}

export function useFadingCarousel<T extends ReactSpringCarouselItem>({
  items,
  withLoop = true,
  // withThumbs = true,
  springConfig = config.default
}: FadingCarouselProps<T>) {
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const [activeItem, setActiveItem] = useState(0)

  const transitions = useTransition(activeItem, {
    config: springConfig,
    key: () => items[activeItem].id,
    initial: {
      opacity: 1
    },
    from: {
      opacity: 0
    },
    enter: {
      opacity: 1,
      position: 'relative'
    },
    leave: {
      opacity: 0,
      position: 'absolute'
    }
  })
  const itemsFragment = transitions((styles, item) => (
    <animated.div
      // @ts-ignore
      style={{
        ...styles,
        flex: '1 0 100%',
        width: '100%'
      }}
    >
      {items[item].renderItem}
    </animated.div>
  ))

  function slideToNextItem() {
    const isLastItem = activeItem === items.length - 1

    if (withLoop) {
      if (isLastItem) {
        setActiveItem(0)
      } else {
        setActiveItem((prev) => prev + 1)
      }
    } else {
      if (!isLastItem) {
        setActiveItem((prev) => prev + 1)
      }
    }
  }

  function slideToPrevItem() {
    const isFirstItem = activeItem === 0

    if (withLoop) {
      if (isFirstItem) {
        setActiveItem(items.length - 1)
      } else {
        setActiveItem((prev) => prev - 1)
      }
    } else {
      if (!isFirstItem) {
        setActiveItem((prev) => prev - 1)
      }
    }
  }

  const carouselFragment = (
    <div
      ref={mainCarouselWrapperRef}
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {itemsFragment}
    </div>
  )

  return {
    carouselFragment,
    slideToNextItem,
    slideToPrevItem
  }
}
