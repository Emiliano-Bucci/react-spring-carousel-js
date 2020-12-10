import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  forwardRef
} from 'react'
import { useSpring, config, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import screenfull from 'screenfull'
import {
  prepareDataForCustomEvent,
  useCustomEventListener,
  useMount
} from './index.utils'
import {
  CarouselProps,
  ReactSpringCarouselContextProps,
  ReactSpringCarouselItem,
  ReactSpringCustomEvents
} from './types'

const InternalCarouselWrapper = forwardRef(
  (
    { children }: { children: React.ReactNode },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    )
  }
)

function InternalThumbsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        padding: 32
      }}
    >
      <div
        style={{
          display: 'flex'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const ReactSpringCarouselContext = createContext<ReactSpringCarouselContextProps>(
  {
    isFullscreen: false,
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

export function useReactSpringCarousel<T extends ReactSpringCarouselItem>({
  items,
  withLoop = false,
  draggingSlideTreshold = 50,
  springConfig = config.default,
  shouldResizeOnWindowResize = true,
  CustomThumbsWrapper,
  CustomWrapper,
  onItemStartToChange = () => {},
  onItemChange = () => {},
  withTumbs = true,
  enableThumbsWrapperScroll = true
}: CarouselProps<T>) {
  const internalItems = withLoop
    ? [items[items.length - 1], ...items, items[0]]
    : items
  const activeItem = useRef(0)
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const thumbsWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const isAnimating = useRef(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    x: 0,
    config: springConfig
  }))
  const { emitCustomEvent, useListenToCustomEvent } = useCustomEventListener()
  const [thumbWrapperScrollStyles, setThumbWrapperScrollStyles] = useSpring(
    () => ({
      x: 0,
      config: springConfig
    })
  )
  const bindDrag = useDrag((props) => {
    const dragging = props.dragging
    const movement = props.movement[0]

    const currentSlidedValue = -(
      getCarouselWrapperWidth() * getCurrentActiveItem()
    )

    if (isAnimating.current) {
      return
    }

    if (dragging) {
      setCarouselStyles({ x: currentSlidedValue + movement })
      isDragging.current = true

      emitCustomEvent(
        ReactSpringCustomEvents['RCSJS:onDrag'],
        prepareDataForCustomEvent(props)
      )
    }

    if (props.last) {
      const prevItemTreshold = movement > draggingSlideTreshold
      const nextItemTreshold = movement < -draggingSlideTreshold

      if (nextItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === internalItems.length - 1) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          slideToNextItem()
        }
      } else if (prevItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === 0) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          slideToPrevItem()
        }
      } else {
        setCarouselStyles({ x: currentSlidedValue })
      }
    }
  })

  // Perform some check on first mount
  useMount(() => {
    if (withTumbs) {
      const missingThumbs = items.some((item) => !item.renderThumb)

      if (missingThumbs) {
        throw new Error(
          'The renderThumb property is missing in one or more items. You need to add the renderThumb property to every item of the carousel when withThumbs={true}'
        )
      }
    }

    if (!withTumbs && !!CustomThumbsWrapper) {
      console.warn(
        "You set withThumbs={false} but you're still passing a <CustomThumbsWrapper /> component."
      )
    }

    if (!shouldResizeOnWindowResize) {
      console.warn(
        'You set shouldResizeOnWindowResize={false}; be aware that the carousel could behave in a strange way if you also use the fullscreen functionality.'
      )
    }
  })

  useEffect(() => {
    if (enableThumbsWrapperScroll) {
      const currentThumbItemNode = document.getElementById(
        `thumb-${items[getCurrentActiveItem()].id}`
      )

      if (currentThumbItemNode) {
        const thumbLeftPosition =
          currentThumbItemNode.offsetLeft + currentThumbItemNode.offsetWidth / 2
        const tumbScrollWidth =
          thumbsWrapperRef.current!.getBoundingClientRect().width / 2

        setThumbWrapperScrollStyles({
          from: {
            x: thumbsWrapperRef.current!.scrollLeft
          },
          to: {
            x: thumbLeftPosition - tumbScrollWidth
          }
        })
      }
    }
  }, [
    activeItem,
    enableThumbsWrapperScroll,
    items,
    setThumbWrapperScrollStyles
  ])

  useEffect(() => {
    const _carouselwrapperRef = mainCarouselWrapperRef.current

    function handleFullscreenChange(event: Event) {
      if (
        document.fullscreenElement &&
        event.target === mainCarouselWrapperRef.current &&
        !isFullscreen
      ) {
        setIsFullscreen(true)
      }

      if (
        !document.fullscreenElement &&
        event.target === mainCarouselWrapperRef.current &&
        isFullscreen
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
  }, [isFullscreen])

  // @ts-ignore
  useEffect(() => {
    function handleResize() {
      setCarouselStyles({
        x: -(getCarouselWrapperWidth() * getCurrentActiveItem()),
        immediate: true
      })
    }

    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [setCarouselStyles, shouldResizeOnWindowResize])

  function setActiveItem(newItem: number) {
    activeItem.current = newItem
  }

  function getCurrentActiveItem() {
    return activeItem.current
  }

  function handleEnterFullscreen(element: HTMLElement) {
    if (screenfull.isEnabled) {
      screenfull.request(element)
    }
  }

  function getPrevItem() {
    return getCurrentActiveItem() - 1
  }

  function getNextItem() {
    return getCurrentActiveItem() + 1
  }

  function getCarouselWrapperWidth() {
    if (!carouselWrapperRef.current) {
      return 0
    }

    return carouselWrapperRef.current.getBoundingClientRect().width
  }

  function slideToItem({
    item,
    immediate = false,
    onRest = () => {}
  }: {
    item: number
    immediate?: boolean
    onRest?(): void
  }) {
    setActiveItem(item)
    isAnimating.current = true

    setCarouselStyles({
      x: -(getCarouselWrapperWidth() * item),
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
          prepareDataForCustomEvent({
            prevItem: getPrevItem(),
            currentItem: getCurrentActiveItem(),
            nextItem: getNextItem()
          })
        )
      }
    })
  }

  function slideToPrevItem() {
    if (
      (!withLoop && getCurrentActiveItem() === 0) ||
      (isDragging.current && isAnimating.current)
    ) {
      return
    }

    emitCustomEvent(
      ReactSpringCustomEvents['RCSJS:onSlideStartChange'],
      prepareDataForCustomEvent({
        prevItem: getPrevItem(),
        currentItem: getCurrentActiveItem(),
        nextItem: getNextItem()
      })
    )
    onItemStartToChange()

    if (withLoop && getCurrentActiveItem() === 0) {
      if (isDragging.current) {
        slideToItem({
          item: getPrevItem(),
          onRest: () => {
            setActiveItem(internalItems.length - 3)
            slideToItem({
              item: internalItems.length - 3,
              immediate: true,
              onRest: onItemChange
            })
          }
        })
      } else {
        slideToItem({
          item: internalItems.length - 2,
          immediate: true,
          onRest: () => {
            slideToItem({
              item: internalItems.length - 3,
              onRest: onItemChange
            })
          }
        })
      }
      return
    }

    slideToItem({
      item: getPrevItem(),
      onRest: onItemChange
    })
  }

  function slideToNextItem() {
    if (
      (!withLoop && activeItem.current === internalItems.length - 1) ||
      (isDragging.current && isAnimating.current)
    ) {
      return
    }

    emitCustomEvent(
      ReactSpringCustomEvents['RCSJS:onSlideStartChange'],
      prepareDataForCustomEvent({
        prevItem: getPrevItem(),
        currentItem: getCurrentActiveItem(),
        nextItem: getNextItem()
      })
    )
    onItemStartToChange()

    if (withLoop && activeItem.current === internalItems.length - 3) {
      if (!isDragging.current) {
        slideToItem({
          item: -1,
          immediate: true,
          onRest: () => {
            slideToItem({
              item: 0,
              onRest: onItemChange
            })
          }
        })
      } else {
        slideToItem({
          item: getNextItem(),
          onRest: () => {
            setActiveItem(0)
            slideToItem({
              item: 0,
              immediate: true,
              onRest: onItemChange
            })
          }
        })
      }

      return
    }

    slideToItem({
      item: getNextItem(),
      onRest: onItemChange
    })
  }

  function findItemIndex(id: string) {
    return items.findIndex((item) => item.id === id)
  }

  const ThumbsWrapper = CustomThumbsWrapper || InternalThumbsWrapper
  const CarouselWrapper = CustomWrapper || InternalCarouselWrapper

  const thumbsFragment = withTumbs ? (
    <animated.div
      scrollLeft={thumbWrapperScrollStyles.x}
      ref={thumbsWrapperRef}
      style={{
        overflowX: 'auto'
      }}
    >
      <ThumbsWrapper>
        {items.map((item, index) => {
          const thumbId = `thumb-${item.id}`

          return (
            <div
              key={thumbId}
              id={thumbId}
              onClick={() => slideToItem({ item: index })}
            >
              {item.renderThumb}
            </div>
          )
        })}
      </ThumbsWrapper>
    </animated.div>
  ) : null

  const contextProps: ReactSpringCarouselContextProps = {
    isFullscreen,
    useListenToCustomEvent,
    enterFullscreen: (elementRef) => {
      handleEnterFullscreen(elementRef || mainCarouselWrapperRef.current!)
    },
    exitFullscreen: () => screenfull.isEnabled && screenfull.exit(),
    getIsAnimating: () => isAnimating.current,
    getIsDragging: () => isDragging.current,
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
      <CarouselWrapper ref={mainCarouselWrapperRef}>
        <animated.div
          {...bindDrag()}
          style={{
            display: 'flex',
            position: 'relative',
            width: '100%',
            height: '100%',
            ...carouselStyles
          }}
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
            <div
              key={`${id}-${index}`}
              style={{
                flex: '1 0 100%'
              }}
            >
              {renderItem}
            </div>
          ))}
        </animated.div>
      </CarouselWrapper>
    </ReactSpringCarouselContext.Provider>
  )

  return {
    carouselFragment,
    thumbsFragment,
    ...contextProps
  }
}

export * from './types'
