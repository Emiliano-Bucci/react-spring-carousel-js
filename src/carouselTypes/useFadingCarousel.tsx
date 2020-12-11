import React, { useRef } from 'react'
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
  springConfig: SpringConfig
  springAnimationPops: SpringAnimationProps<T>
}

export function useFadingCarousel<T extends ReactSpringCarouselItem>({
  items,
  // withThumbs = true,
  springConfig = config.default,
  springAnimationPops = {
    from: {
      opacity: 0
    },
    enter: {
      opacity: 1
    },
    leave: {
      opacity: 0
    }
  }
}: FadingCarouselProps<T>) {
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const activeItem = useRef(0)

  const transitions = useTransition(items[activeItem.current], {
    config: springConfig,
    ...springAnimationPops
  })
  const itemsFragment = transitions((styles, item) => (
    <animated.div
      style={{
        ...styles,
        flex: '1 0 100%',
        height: '100%'
      }}
    >
      {item}
    </animated.div>
  ))

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
    carouselFragment
  }
}
