import React, { useRef, createContext, useCallback } from 'react'
import { useSpring, config, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import screenfull from 'screenfull'
import {
  fixNegativeIndex,
  prepareDataForCustomEvent,
  useCustomEventListener,
  useMount
} from '../index.utils'
import { useThumbsModule } from '../modules/useThumbsModule'
import {
  CarouselProps,
  RCSJOnFullscreenChange,
  RCSJSOnDrag,
  RCSJSOnSlideChange,
  RCSJSOnSlideStartChange,
  ReactSpringCarouselContextProps,
  ReactSpringCarouselItem,
  ReactSpringCustomEvents,
  SlideToItemFnProps
} from '../types'

export const ReactSpringCarouselContext = createContext<ReactSpringCarouselContextProps>(
  {
    getIsFullscreen: () => false,
    getIsPrevItem: () => false,
    getIsNextItem: () => false,
    slideToItem: () => {},
    getIsAnimating: () => false,
    getIsDragging: () => false,
    getIsActiveItem: () => false,
    enterFullscreen: () => {},
    exitFullscreen: () => {},
    slideToPrevItem: () => {},
    slideToNextItem: () => {},
    useListenToCustomEvent: () => {}
  }
)

export function useTransformCarousel<T extends ReactSpringCarouselItem>({
  items,
  withLoop = false,
  draggingSlideTreshold = 50,
  springConfig = config.default,
  shouldResizeOnWindowResize = true,
  withThumbs = true,
  enableThumbsWrapperScroll = true,
  carouselSlideAxis = 'x',
  thumbsSlideAxis = 'x',
  thumbsMaxHeight = 0,
  thumbsWrapperRef
}: CarouselProps<T>) {
  const internalItems = withLoop
    ? [items[items.length - 1], ...items, items[0]]
    : items
  const activeItem = useRef(0)
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const isFullscreen = useRef(false)

  const isDragging = useRef(false)
  const isAnimating = useRef(false)
  const { emitCustomEvent, useListenToCustomEvent } = useCustomEventListener()
  // @ts-ignore
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    [carouselSlideAxis]: 0,
    config: springConfig
  }))

  const { thumbsFragment, handleThumbsScroll } = useThumbsModule({
    withThumbs,
    items,
    thumbsSlideAxis,
    thumbsMaxHeight,
    springConfig,
    getCurrentActiveItem,
    slideToItem,
    thumbsWrapperRef
  })

  const bindDrag = useDrag((props) => {
    const dragging = props.dragging
    const movement = props.movement[carouselSlideAxis === 'x' ? 0 : 1]

    const currentSlidedValue = -(getWrapperDimension() * getCurrentActiveItem())

    if (getIsAnimating()) {
      return
    }

    if (dragging) {
      setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue + movement })
      isDragging.current = true

      emitCustomEvent(
        ReactSpringCustomEvents['RCSJS:onDrag'],
        prepareDataForCustomEvent<RCSJSOnDrag>(props)
      )
    }

    if (props.last) {
      const prevItemTreshold = movement > draggingSlideTreshold
      const nextItemTreshold = movement < -draggingSlideTreshold

      if (nextItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === internalItems.length - 1) {
          setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
        } else {
          slideToNextItem()
        }
      } else if (prevItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === 0) {
          setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
        } else {
          slideToPrevItem()
        }
      } else {
        setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
      }
    }
  })

  // Perform some check on first mount
  useMount(() => {
    if (!shouldResizeOnWindowResize) {
      console.warn(
        'You set shouldResizeOnWindowResize={false}; be aware that the carousel could behave in a strange way if you also use the fullscreen functionality.'
      )
    }
  })

  const getWrapperDimension = useCallback(() => {
    if (!carouselWrapperRef.current) {
      return 0
    }

    if (carouselSlideAxis === 'x') {
      return carouselWrapperRef.current.getBoundingClientRect().width
    }

    return carouselWrapperRef.current.getBoundingClientRect().height
  }, [carouselSlideAxis])

  function setIsFullscreen(_isFullscreen: boolean) {
    isFullscreen.current = _isFullscreen
  }

  useMount(() => {
    const _carouselwrapperRef = mainCarouselWrapperRef.current

    function handleFullscreenChange(event: Event) {
      if (
        document.fullscreenElement &&
        event.target === mainCarouselWrapperRef.current &&
        !getIsFullscreen()
      ) {
        setIsFullscreen(true)
      }

      if (
        !document.fullscreenElement &&
        event.target === mainCarouselWrapperRef.current &&
        getIsFullscreen()
      ) {
        setIsFullscreen(false)
      }
    }

    _carouselwrapperRef!.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    )

    return () => {
      _carouselwrapperRef!.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      )
    }
  })

  function adjustCarouselWrapperPosition(ref: HTMLDivElement) {
    const positionProperty = carouselSlideAxis === 'x' ? 'left' : 'top'
    const dimensionProperty = carouselSlideAxis === 'x' ? 'width' : 'height'

    ref.style[positionProperty] = `-${
      ref.getBoundingClientRect()[dimensionProperty]
    }px`
  }

  // @ts-ignore
  useMount(() => {
    function handleResize() {
      setCarouselStyles({
        [carouselSlideAxis]: -(getWrapperDimension() * getCurrentActiveItem()),
        immediate: true
      })

      if (withLoop) {
        adjustCarouselWrapperPosition(carouselWrapperRef.current!)
      }
    }

    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  })

  function getIsFullscreen() {
    return isFullscreen.current
  }

  function setActiveItem(newItem: number) {
    activeItem.current = newItem
  }

  function getCurrentActiveItem() {
    return activeItem.current
  }

  function handleEnterFullscreen(element: HTMLElement) {
    if (screenfull.isEnabled) {
      screenfull.request(element)

      emitCustomEvent(
        ReactSpringCustomEvents['RCSJS:onFullscreenChange'],
        prepareDataForCustomEvent<RCSJOnFullscreenChange>({
          isFullscreen: true
        })
      )
    }
  }

  function getIsAnimating() {
    return isAnimating.current
  }

  function getIsDragging() {
    return isDragging.current
  }

  function getPrevItem() {
    return getCurrentActiveItem() - 1
  }

  function getNextItem() {
    return getCurrentActiveItem() + 1
  }

  function slideToItem({
    item,
    immediate = false,
    onRest = () => {}
  }: SlideToItemFnProps) {
    if (!immediate) {
      setActiveItem(fixNegativeIndex(item, items.length))
    }

    isAnimating.current = true

    setCarouselStyles({
      [carouselSlideAxis]: -(getWrapperDimension() * item),
      config: {
        ...springConfig,
        duration: immediate ? 0 : undefined
      },
      onRest: () => {
        isDragging.current = false
        isAnimating.current = false
        onRest()

        emitCustomEvent(
          ReactSpringCustomEvents['RCSJS:onSlideChange'],
          prepareDataForCustomEvent<RCSJSOnSlideChange>({
            prevItem: getPrevItem(),
            currentItem: getCurrentActiveItem(),
            nextItem: getNextItem()
          })
        )
      }
    })

    if (enableThumbsWrapperScroll) {
      handleThumbsScroll()
    }
  }

  function slideToPrevItem() {
    if (
      (!withLoop && getCurrentActiveItem() === 0) ||
      (getIsDragging() && getIsAnimating())
    ) {
      return
    }

    emitCustomEvent(
      ReactSpringCustomEvents['RCSJS:onSlideStartChange'],
      prepareDataForCustomEvent<RCSJSOnSlideStartChange>({
        prevItem: getPrevItem(),
        currentItem: getCurrentActiveItem(),
        nextItem: getNextItem()
      })
    )

    if (withLoop && getCurrentActiveItem() === 0) {
      if (getIsDragging()) {
        slideToItem({
          item: getPrevItem(),
          onRest: () => {
            slideToItem({
              item: internalItems.length - 3,
              immediate: true
            })
          }
        })
      } else {
        slideToItem({
          item: internalItems.length - 2,
          immediate: true,
          onRest: () => {
            slideToItem({
              item: internalItems.length - 3
            })
          }
        })
      }
      return
    }

    slideToItem({
      item: getPrevItem()
    })
  }

  function slideToNextItem() {
    if (
      (!withLoop && getCurrentActiveItem() === internalItems.length - 1) ||
      (getIsDragging() && getIsAnimating())
    ) {
      return
    }

    emitCustomEvent(
      ReactSpringCustomEvents['RCSJS:onSlideStartChange'],
      prepareDataForCustomEvent<RCSJSOnSlideStartChange>({
        prevItem: getPrevItem(),
        currentItem: getCurrentActiveItem(),
        nextItem: getNextItem()
      })
    )

    if (withLoop && getCurrentActiveItem() === internalItems.length - 3) {
      if (getIsDragging()) {
        slideToItem({
          item: getNextItem(),
          onRest: () => {
            setActiveItem(0)
            slideToItem({
              item: 0,
              immediate: true
            })
          }
        })
      } else {
        slideToItem({
          item: -1,
          immediate: true,
          onRest: () => {
            slideToItem({
              item: 0
            })
          }
        })
      }

      return
    }

    slideToItem({
      item: getNextItem()
    })
  }

  function findItemIndex(id: string) {
    return items.findIndex((item) => item.id === id)
  }

  const contextProps: ReactSpringCarouselContextProps = {
    getIsFullscreen,
    useListenToCustomEvent,
    enterFullscreen: (elementRef) => {
      handleEnterFullscreen(elementRef || mainCarouselWrapperRef.current!)
    },
    exitFullscreen: () => {
      screenfull.isEnabled && screenfull.exit()

      emitCustomEvent(
        ReactSpringCustomEvents['RCSJS:onFullscreenChange'],
        prepareDataForCustomEvent<RCSJOnFullscreenChange>({
          isFullscreen: false
        })
      )
    },
    getIsAnimating,
    getIsDragging,
    getIsNextItem: (id) => findItemIndex(id) - 1 === getCurrentActiveItem(),
    getIsPrevItem: (id) => findItemIndex(id) - 1 === getCurrentActiveItem() - 2,
    getIsActiveItem: (id) => findItemIndex(id) === getCurrentActiveItem(),
    slideToPrevItem,
    slideToNextItem,
    slideToItem: (item, callback) => {
      slideToItem({
        item,
        onRest: callback
      })
    }
  }

  const carouselFragment = (
    <ReactSpringCarouselContext.Provider value={contextProps}>
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
        <animated.div
          {...bindDrag()}
          style={{
            display: 'flex',
            flexDirection: carouselSlideAxis === 'x' ? 'row' : 'column',
            position: 'relative',
            width: '100%',
            height: '100%',
            ...carouselStyles
          }}
          ref={(ref) => {
            if (ref) {
              carouselWrapperRef.current = ref

              if (withLoop) {
                adjustCarouselWrapperPosition(ref)
              }
            }
          }}
        >
          {internalItems.map(({ id, renderItem }, index) => (
            <div
              key={`${id}-${index}`}
              style={{
                flex: '1 0 100%',
                height: '100%'
              }}
            >
              {renderItem}
            </div>
          ))}
        </animated.div>
      </div>
    </ReactSpringCarouselContext.Provider>
  )

  return {
    carouselFragment,
    thumbsFragment,
    ...contextProps
  }
}
