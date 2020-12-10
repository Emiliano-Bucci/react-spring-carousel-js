import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  useCallback
} from 'react'
import { useSpring, config, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import screenfull from 'screenfull'
import { InternalThumbsWrapper, InternalCarouselWrapper } from './index.styles'
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
  enableThumbsWrapperScroll = true,
  carouselSlideAxis = 'x',
  thumbsSlideAxis = 'x',
  thumbsMaxHeight = 0
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
  const { emitCustomEvent, useListenToCustomEvent } = useCustomEventListener()
  // @ts-ignore
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    [carouselSlideAxis]: 0,
    config: springConfig
  }))
  // @ts-ignore
  const [thumbWrapperScrollStyles, setThumbWrapperScrollStyles] = useSpring(
    () => ({
      [thumbsSlideAxis]: 0,
      config: springConfig
    })
  )
  const bindDrag = useDrag((props) => {
    const dragging = props.dragging
    const movement = props.movement[carouselSlideAxis === 'x' ? 0 : 1]

    const currentSlidedValue = -(getWrapperDimention() * getCurrentActiveItem())

    if (isAnimating.current) {
      return
    }

    if (dragging) {
      setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue + movement })
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

    if (thumbsSlideAxis === 'y' && thumbsMaxHeight === 0) {
      console.warn(
        'When you set thumbsSlideAxis=`y` remember also to set a truthy thumbsMaxHeight value.'
      )
    }

    if (thumbsSlideAxis === 'x' && thumbsMaxHeight > 0) {
      console.warn(
        "There's no need to specify a thumbsMaxHeight value when thumbsSlideAxis=`x`; the value will be omitted."
      )
    }
  })

  const getWrapperDimention = useCallback(() => {
    if (!carouselWrapperRef.current) {
      return 0
    }

    if (carouselSlideAxis === 'x') {
      return carouselWrapperRef.current.getBoundingClientRect().width
    }

    return carouselWrapperRef.current.getBoundingClientRect().height
  }, [carouselSlideAxis])

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
        [carouselSlideAxis]: -(getWrapperDimention() * getCurrentActiveItem()),
        immediate: true
      })
    }

    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [
    getWrapperDimention,
    setCarouselStyles,
    shouldResizeOnWindowResize,
    carouselSlideAxis
  ])

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
      [carouselSlideAxis]: -(getWrapperDimention() * item),
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

    if (enableThumbsWrapperScroll) {
      const currentThumbItemNode = document.getElementById(
        `thumb-${items[getCurrentActiveItem()].id}`
      )

      if (currentThumbItemNode) {
        const offsetDirection =
          thumbsSlideAxis === 'x' ? 'offsetLeft' : 'offsetTop'
        const offsetDimension =
          thumbsSlideAxis === 'x' ? 'offsetWidth' : 'offsetHeight'
        const dimension = thumbsSlideAxis === 'x' ? 'width' : 'height'
        const scrollDirection =
          thumbsSlideAxis === 'x' ? 'scrollLeft' : 'scrollTop'

        const thumbOffsetPosition =
          currentThumbItemNode[offsetDirection] +
          currentThumbItemNode[offsetDimension] / 2
        const thumbScrollDimension =
          thumbsWrapperRef.current!.getBoundingClientRect()[dimension] / 2

        setThumbWrapperScrollStyles({
          from: {
            [thumbsSlideAxis]: thumbsWrapperRef.current![scrollDirection]
          },
          to: {
            [thumbsSlideAxis]: thumbOffsetPosition - thumbScrollDimension
          }
        })
      }
    }
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

  function getThumbsScrollDirection() {
    if (thumbsSlideAxis === 'x') {
      return {
        scrollLeft: thumbWrapperScrollStyles.x
      }
    }

    return {
      scrollTop: thumbWrapperScrollStyles.y
    }
  }

  const thumbsFragment = withTumbs ? (
    <ThumbsWrapper>
      <animated.div
        {...getThumbsScrollDirection()}
        ref={thumbsWrapperRef}
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: thumbsSlideAxis === 'x' ? 'row' : 'column',
          ...(thumbsSlideAxis === 'x'
            ? { overflowX: 'auto' }
            : { overflowY: 'auto', maxHeight: thumbsMaxHeight })
        }}
      >
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
      </animated.div>
    </ThumbsWrapper>
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
                const position = carouselSlideAxis === 'x' ? 'left' : 'top'

                ref.style[position] = `-${ref.getBoundingClientRect().width}px`
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
