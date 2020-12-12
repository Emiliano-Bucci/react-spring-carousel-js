import React, { useRef, useState, createContext } from 'react'
import {
  useTransition,
  SpringConfig,
  animated,
  config,
  TransitionFrom,
  TransitionTo
} from 'react-spring'
import { prepareDataForCustomEvent } from '../index.utils'
import {
  ListenToCustomEvent,
  useCustomEventsModule
} from '../modules/useCustomEventsModule'
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

type FadingCarouselContextProps = {
  activeItem: number
  slideToNextItem(): void
  slideToPrevItem(): void
  enterFullscreen(elementRef?: HTMLElement): void
  exitFullscreen(): void
  slideToItem(item: number): void
  getIsAnimating(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  useListenToCustomEvent: ListenToCustomEvent
}

const FadingCarouselContext = createContext<FadingCarouselContextProps>({
  activeItem: 0,
  slideToNextItem: () => {},
  slideToPrevItem: () => {},
  enterFullscreen: () => {},
  exitFullscreen: () => {},
  slideToItem: () => {},
  getIsAnimating: () => false,
  getIsPrevItem: () => false,
  getIsNextItem: () => false,
  useListenToCustomEvent: () => {}
})

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
  const isAnimating = useRef(false)
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
      isAnimating.current = false
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
    isAnimating.current = true
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

  function getIsAnimating() {
    return isAnimating.current
  }

  function findItemIndex(id: string) {
    return items.findIndex((item) => item.id === id)
  }

  function getIsNextItem(id: string) {
    const itemIndex = findItemIndex(id)

    if (withLoop && activeItem === items.length - 1) {
      return itemIndex === 0
    }

    return itemIndex === activeItem + 1
  }

  function getIsPrevItem(id: string) {
    const itemIndex = findItemIndex(id)

    if (withLoop && activeItem === 0) {
      return itemIndex === items.length - 1
    }

    return itemIndex === activeItem - 1
  }

  const contextProps: FadingCarouselContextProps = {
    activeItem,
    slideToNextItem,
    slideToPrevItem,
    enterFullscreen,
    exitFullscreen,
    useListenToCustomEvent,
    slideToItem,
    getIsAnimating,
    getIsNextItem,
    getIsPrevItem
  }

  const carouselFragment = (
    <FadingCarouselContext.Provider value={contextProps}>
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
    </FadingCarouselContext.Provider>
  )

  return {
    carouselFragment,
    ...contextProps
  }
}
