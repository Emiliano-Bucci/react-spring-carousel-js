import React, { createContext, useRef, useState } from 'react'
import { useTransition, animated, config } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { prepareDataForCustomEvent } from '../index.utils'
import { useCustomEventsModule } from '../modules/useCustomEventsModule'
import { useFullscreenModule } from '../modules/useFullscreenModule'
import { useThumbsModule } from '../modules/useThumbsModule'
import {
  OnSlideChange,
  OnSlideStartChange,
  ReactSpringCarouselItem,
  TransitionCarouselContextProps,
  TransitionCarouselProps,
  SlideActionType
} from '../types'

const UseTransitionCarouselContext = createContext<TransitionCarouselContextProps>(
  {
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
  }
)

export function useTransitionCarousel<T extends ReactSpringCarouselItem>({
  items,
  withLoop = false,
  withThumbs = false,
  springConfig = config.default,
  thumbsSlideAxis = 'x',
  enableThumbsWrapperScroll = true,
  draggingSlideTreshold = 50,
  prepareThumbsData,
  onLeftSwipe,
  onRightSwipe,
  springAnimationPops = {
    initial: {
      opacity: 1
    },
    from: {
      opacity: 0,
      position: 'absolute'
    },
    enter: {
      opacity: 1,
      position: 'relative'
    },
    leave: {
      opacity: 0,
      position: 'absolute'
    }
  }
}: TransitionCarouselProps<T>) {
  const slideActionType = useRef<SlideActionType>('next')
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const isAnimating = useRef(false)
  const [activeItem, setActiveItem] = useState(0)

  const { emitCustomEvent, useListenToCustomEvent } = useCustomEventsModule()
  const { enterFullscreen, exitFullscreen } = useFullscreenModule({
    emitCustomEvent,
    mainCarouselWrapperRef
  })
  const {
    thumbsFragment: _thumbsFragment,
    handleThumbsScroll
  } = useThumbsModule({
    items,
    withThumbs,
    thumbsSlideAxis,
    springConfig,
    prepareThumbsData
  })

  const bindSwipe = useDrag(({ last, movement: [mx] }) => {
    if (getIsAnimating()) {
      return
    }

    if (last) {
      const prevItemTreshold = mx > draggingSlideTreshold
      const nextItemTreshold = mx < -draggingSlideTreshold
      const isFirstItem = activeItem === 0
      const isLastItem = activeItem === items.length - 1

      if (nextItemTreshold) {
        if (!withLoop && isLastItem) {
          return
        }

        onLeftSwipe && onLeftSwipe()
        emitCustomEvent('onLeftSwipe')
      } else if (prevItemTreshold) {
        if (!withLoop && isFirstItem) {
          return
        }

        onRightSwipe && onRightSwipe()
        emitCustomEvent('onRightSwipe')
      }
    }
  })

  // @ts-ignore
  const transitions = useTransition(activeItem, {
    config: springConfig,
    key: () => items[activeItem].id,
    initial: springAnimationPops.initial,
    from: {
      ...springAnimationPops.from,
      __internal: false
    },
    enter: {
      ...springAnimationPops.enter,
      __internal: true
    },
    leave: {
      ...springAnimationPops.leave,
      __internal: false
    },
    onStart: () => {
      setIsAnimating(true)
    },
    onRest: (val) => {
      if (val.finished && val.value.__internal) {
        setIsAnimating(false)
        emitCustomEvent(
          'onSlideChange',
          prepareDataForCustomEvent<OnSlideChange>({
            currentItem: activeItem,
            slideActionType: getSlideActionType()
          })
        )
      }
    }
  })
  const itemsFragment = transitions((styles, item) => (
    <animated.div
      // @ts-ignore
      style={{
        ...styles,
        flex: '1 0 100%',
        width: '100%',
        height: '100%'
      }}
    >
      {items[item].renderItem}
    </animated.div>
  ))

  function getIsAnimating() {
    return isAnimating.current
  }
  function setIsAnimating(val: boolean) {
    isAnimating.current = val
  }
  function setSlideActionType(type: SlideActionType) {
    slideActionType.current = type
  }
  function getSlideActionType() {
    return slideActionType.current
  }
  function slideToItem(item: string | number) {
    let itemIndex = 0

    if (typeof item === 'string') {
      itemIndex = items.findIndex((_item) => _item.id === item)
    } else {
      itemIndex = item
    }

    if (itemIndex >= items.length) {
      throw Error(
        `The item you want to slide to doesn't exist. This could be due to the fact that 
        you provide a wrong id or a higher numeric index.`
      )
    }

    if (itemIndex === activeItem) {
      return
    }

    const currentItem = findItemIndex(items[activeItem].id)
    const newActiveItem = findItemIndex(items[itemIndex].id)

    if (newActiveItem > currentItem) {
      setSlideActionType('next')
    } else {
      setSlideActionType('prev')
    }

    setActiveItem(itemIndex)

    emitCustomEvent(
      'onSlideStartChange',
      prepareDataForCustomEvent<OnSlideStartChange>({
        nextItem: itemIndex,
        slideActionType: getSlideActionType()
      })
    )

    if (enableThumbsWrapperScroll && withThumbs) {
      handleThumbsScroll(itemIndex)
    }
  }
  function slideToNextItem() {
    const isLastItem = activeItem === items.length - 1

    if (withLoop) {
      if (isLastItem) {
        slideToItem(0)
      } else {
        slideToItem(activeItem + 1)
      }
      setSlideActionType('next')
    } else {
      if (!isLastItem) {
        slideToItem(activeItem + 1)
        setSlideActionType('next')
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
      setSlideActionType('prev')
    } else {
      if (!isFirstItem) {
        slideToItem(activeItem - 1)
        setSlideActionType('prev')
      }
    }
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

  const contextProps: TransitionCarouselContextProps = {
    activeItem,
    slideToItem,
    slideToNextItem,
    slideToPrevItem,
    enterFullscreen,
    exitFullscreen,
    useListenToCustomEvent,
    getIsNextItem,
    getIsPrevItem,
    getIsAnimating
  }

  const carouselFragment = (
    <UseTransitionCarouselContext.Provider value={contextProps}>
      <div
        ref={mainCarouselWrapperRef}
        {...bindSwipe()}
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
    </UseTransitionCarouselContext.Provider>
  )

  const thumbsFragment = (
    <UseTransitionCarouselContext.Provider value={contextProps}>
      {_thumbsFragment}
    </UseTransitionCarouselContext.Provider>
  )

  return {
    carouselFragment,
    thumbsFragment,
    ...contextProps
  }
}
