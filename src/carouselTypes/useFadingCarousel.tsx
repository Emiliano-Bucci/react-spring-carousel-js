import React, { useRef, useState } from 'react'
import {
  useTransition,
  SpringConfig,
  animated,
  config,
  TransitionFrom,
  TransitionTo
} from 'react-spring'
import { prepareDataForCustomEvent } from '../index.utils'
import { useCustomEventsModule } from '../modules/useCustomEventsModule'
import { useFullscreenModule } from '../modules/useFullscreenModule'
import {
  RCSJSOnSlideChange,
  RCSJSOnSlideStartChange,
  ReactSpringCarouselItem,
  ReactSpringCustomEvents
} from '../types'

type SpringAnimationProps<Item> = {
  initial: TransitionFrom<Item>
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
  springConfig = config.default,
  springAnimationPops = {
    initial: {
      opacity: 1
    },
    from: {
      opacity: 0
    },
    enter: {
      opacity: 1
    },
    leave: {
      opacity: 0,
      position: 'absolute'
    }
  }
}: FadingCarouselProps<T>) {
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const [activeItem, setActiveItem] = useState(0)

  const { emitCustomEvent, useListenToCustomEvent } = useCustomEventsModule()
  const { enterFullscreen, exitFullscreen } = useFullscreenModule({
    emitCustomEvent,
    mainCarouselWrapperRef
  })

  // @ts-ignore
  const transitions = useTransition(activeItem, {
    config: springConfig,
    key: () => items[activeItem].id,
    ...springAnimationPops,
    onRest: () => {
      emitCustomEvent(
        ReactSpringCustomEvents['RCSJS:onSlideChange'],
        prepareDataForCustomEvent<RCSJSOnSlideChange>({
          prevItem: getPrevItem(),
          currentItem: activeItem,
          nextItem: getNextItem()
        })
      )
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

  function getPrevItem() {
    if (activeItem === 0) {
      return items.length - 1
    }

    return activeItem
  }

  function getNextItem() {
    if (activeItem === items.length - 1) {
      return 0
    }

    return activeItem
  }

  function slideToItem(item: number) {
    emitCustomEvent(
      ReactSpringCustomEvents['RCSJS:onSlideStartChange'],
      prepareDataForCustomEvent<RCSJSOnSlideStartChange>({
        prevItem: getPrevItem(),
        currentItem: activeItem,
        nextItem: getNextItem()
      })
    )
    setActiveItem(item)
  }

  function slideToNextItem() {
    const isLastItem = activeItem === items.length - 1

    if (withLoop) {
      if (isLastItem) {
        slideToItem(0)
      } else {
        slideToItem(activeItem + 1)
      }
    } else {
      if (!isLastItem) {
        slideToItem(activeItem + 1)
      }
    }
  }

  function slideToPrevItem() {
    const isFirstItem = activeItem === 0

    if (withLoop) {
      if (isFirstItem) {
        slideToItem(items.length - 1)
      } else {
        slideToItem(activeItem - 1)
      }
    } else {
      if (!isFirstItem) {
        slideToItem(activeItem - 1)
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
    slideToPrevItem,
    enterFullscreen,
    exitFullscreen,
    useListenToCustomEvent
  }
}
