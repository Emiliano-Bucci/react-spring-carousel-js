import React, { useRef, createContext, useCallback } from 'react'
import { useSpring, config, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import {
  fixNegativeIndex,
  prepareDataForCustomEvent,
  useMount
} from '../index.utils'
import { useCustomEventsModule } from '../modules/useCustomEventsModule'
import { useFullscreenModule } from '../modules/useFullscreenModule'
import { useThumbsModule } from '../modules/useThumbsModule'
import {
  TransformCarouselProps,
  RCSJSOnDrag,
  RCSJSOnSlideChange,
  RCSJSOnSlideStartChange,
  TransformCarouselContextProps,
  ReactSpringCarouselItem,
  ReactSpringCustomEvents,
  SlideToItemFnProps
} from '../types'

export const TransformCarouselContext = createContext<TransformCarouselContextProps>(
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

export function useSpringCarousel<T extends ReactSpringCarouselItem>({
  items,
  withLoop = false,
  draggingSlideTreshold = 100,
  springConfig = config.default,
  shouldResizeOnWindowResize = true,
  withThumbs = false,
  enableThumbsWrapperScroll = true,
  carouselSlideAxis = 'x',
  thumbsSlideAxis = 'x',
  thumbsWrapperRef,
  prepareThumbsData,
  itemsPerSlide = 1,
  initialActiveItem = 0
}: TransformCarouselProps<T>) {
  function getRepeatedPrevItems() {
    const total = items.length
    return items.slice(total - itemsPerSlide, total)
  }
  function getRepeatedNextItems() {
    return items.slice(0, itemsPerSlide)
  }
  function getItems() {
    if (withLoop) {
      return [...getRepeatedPrevItems(), ...items, ...getRepeatedNextItems()]
    }

    return items
  }
  const internalItems = getItems()
  const activeItem = useRef(0)
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselTrackWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const isAnimating = useRef(false)

  // Custom modules
  const { emitCustomEvent, useListenToCustomEvent } = useCustomEventsModule()
  const {
    enterFullscreen,
    exitFullscreen,
    getIsFullscreen
  } = useFullscreenModule({
    mainCarouselWrapperRef,
    emitCustomEvent
  })
  const { thumbsFragment, handleThumbsScroll } = useThumbsModule({
    withThumbs,
    items,
    thumbsSlideAxis,
    springConfig,
    thumbsWrapperRef,
    prepareThumbsData
  })

  // @ts-ignore
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    [carouselSlideAxis]: 0,
    config: springConfig
  }))
  const bindDrag = useDrag((props) => {
    const dragging = props.dragging
    const movement = props.movement[carouselSlideAxis === 'x' ? 0 : 1]

    if (getIsAnimating()) {
      return
    }

    const currentSlidedValue = -(getSlideValue() * getCurrentActiveItem())

    if (dragging) {
      setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue + movement })
      isDragging.current = true

      emitCustomEvent(
        ReactSpringCustomEvents['RCSJS:onDrag'],
        prepareDataForCustomEvent<RCSJSOnDrag>(props)
      )

      const prevItemTreshold = movement > draggingSlideTreshold
      const nextItemTreshold = movement < -draggingSlideTreshold

      if (nextItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === internalItems.length - 1) {
          setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
        } else {
          slideToNextItem()
        }
        props.cancel()
        isDragging.current = false
      } else if (prevItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === 0) {
          setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
        } else {
          slideToPrevItem()
        }
        props.cancel()
        isDragging.current = false
      }
    }

    if (props.last && !getIsAnimating()) {
      setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
    }
  })

  // Perform some check on first mount
  useMount(() => {
    if (!shouldResizeOnWindowResize) {
      console.warn(
        'You set shouldResizeOnWindowResize={false}; be aware that the carousel could behave in a strange way if you also use the fullscreen functionality.'
      )
    }

    if (initialActiveItem < 0) {
      console.warn('The initialActiveItem cannot be less than 0')
    }

    if (initialActiveItem > items.length) {
      console.warn(
        'The initialActiveItem cannot be greater than the total length of the items you provide.'
      )
    }
  })

  // @ts-ignore
  useMount(() => {
    function handleResize() {
      setCarouselStyles({
        [carouselSlideAxis]: -(getSlideValue() * getCurrentActiveItem()),
        immediate: true
      })

      if (withLoop) {
        adjustCarouselWrapperPosition(carouselTrackWrapperRef.current!)
      }
    }

    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  })

  useMount(() => {
    if (initialActiveItem > 0 && initialActiveItem <= items.length) {
      slideToItem({
        item: initialActiveItem,
        immediate: true
      })
      setActiveItem(initialActiveItem)
    }
  })

  const getSlideValue = useCallback(() => {
    if (!carouselTrackWrapperRef.current) {
      return 0
    }

    const carouselItem = carouselTrackWrapperRef.current
      .firstChild as HTMLElement

    if (carouselSlideAxis === 'x') {
      return carouselItem.getBoundingClientRect().width
    }

    return carouselItem.getBoundingClientRect().height
  }, [carouselSlideAxis])

  function adjustCarouselWrapperPosition(ref: HTMLDivElement) {
    const positionProperty = carouselSlideAxis === 'x' ? 'left' : 'top'

    ref.style[positionProperty] = `-${getSlideValue() * itemsPerSlide}px`
  }
  function setActiveItem(newItem: number) {
    activeItem.current = newItem
  }
  function getCurrentActiveItem() {
    return activeItem.current
  }
  function getIsAnimating() {
    return isAnimating.current
  }
  function getIsDragging() {
    return isDragging.current
  }
  function getPrevItem() {
    const currentActiveItem = getCurrentActiveItem()

    if (currentActiveItem === 0) {
      return items.length - 1
    }

    return currentActiveItem - 1
  }
  function getNextItem() {
    const currentActiveItem = getCurrentActiveItem()

    if (currentActiveItem === items.length - 1) {
      return 0
    }

    return currentActiveItem + 1
  }
  function getIsNextItem(id: string) {
    const itemIndex = findItemIndex(id)
    const activeItem = getCurrentActiveItem()

    if (withLoop && activeItem === items.length - 1) {
      return itemIndex === 0
    }

    return itemIndex === activeItem + 1
  }
  function getIsPrevItem(id: string) {
    const itemIndex = findItemIndex(id)
    const activeItem = getCurrentActiveItem()

    if (withLoop && activeItem === 0) {
      return itemIndex === items.length - 1
    }

    return itemIndex === activeItem - 1
  }
  function findItemIndex(id: string) {
    return items.findIndex((item) => item.id === id)
  }

  function slideToItem({
    item,
    immediate = false,
    onRest = () => {}
  }: SlideToItemFnProps) {
    const nextItemIndex = fixNegativeIndex(item, items.length)

    if (!immediate) {
      setActiveItem(nextItemIndex)
    }

    isAnimating.current = true

    setCarouselStyles({
      [carouselSlideAxis]: -(getSlideValue() * item),
      config: {
        ...springConfig
      },
      immediate,
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

    if (enableThumbsWrapperScroll && withThumbs && !immediate) {
      handleThumbsScroll(nextItemIndex)
    }
  }

  function getWrapperFromValue(element: HTMLDivElement) {
    const values = element.style.transform.split(/\w+\(|\);?/)
    return Number(
      values[1]
        .split(/,\s?/g)
        [carouselSlideAxis === 'x' ? 0 : 1].replace('px', '')
    )
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
          item: activeItem.current - 1,
          onRest: () => {
            slideToItem({
              item: items.length - 1,
              immediate: true
            })
          }
        })
      } else {
        let fromValue = 0

        if (carouselTrackWrapperRef.current!.style.transform !== 'none') {
          fromValue = getWrapperFromValue(carouselTrackWrapperRef.current!)
        }

        setCarouselStyles({
          from: {
            [carouselSlideAxis]: -(
              Math.abs(fromValue) +
              getSlideValue() * items.length
            )
          },
          to: {
            [carouselSlideAxis]: -(getSlideValue() * (items.length - 1))
          }
        })
        setActiveItem(items.length - 1)
      }
    } else {
      slideToItem({
        item: getPrevItem()
      })
    }
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

    if (withLoop && getCurrentActiveItem() === items.length - 1) {
      if (getIsDragging()) {
        slideToItem({
          item: activeItem.current + 1,
          onRest: () => {
            setActiveItem(0)
            slideToItem({
              item: 0,
              immediate: true
            })
          }
        })
      } else {
        setCarouselStyles({
          from: {
            [carouselSlideAxis]:
              getWrapperFromValue(carouselTrackWrapperRef.current!) +
              getSlideValue() * items.length
          },
          to: {
            [carouselSlideAxis]: 0
          }
        })
        setActiveItem(0)
      }
    } else {
      slideToItem({
        item: getNextItem()
      })
    }
  }

  const contextProps: TransformCarouselContextProps = {
    useListenToCustomEvent,
    getIsFullscreen,
    enterFullscreen,
    exitFullscreen,
    getIsAnimating,
    getIsDragging,
    getIsNextItem,
    getIsPrevItem,
    getIsActiveItem: (id) => findItemIndex(id) === getCurrentActiveItem(),
    slideToPrevItem,
    slideToNextItem,
    slideToItem: (item) => {
      let itemIndex = 0

      if (typeof item === 'string') {
        itemIndex = items.findIndex((_item) => _item.id === item)
      } else {
        itemIndex = item
      }

      slideToItem({
        item: itemIndex
      })
    }
  }

  const carouselFragment = (
    <TransformCarouselContext.Provider value={contextProps}>
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
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            ...carouselStyles
          }}
          ref={(ref) => {
            if (ref) {
              carouselTrackWrapperRef.current = ref

              if (withLoop) {
                adjustCarouselWrapperPosition(ref)
              }
            }
          }}
        >
          {internalItems.map(({ id, renderItem }, index) => {
            return (
              <div
                key={`${id}-${index}`}
                style={{
                  display: 'flex',
                  flex: `1 0 calc(100% / ${itemsPerSlide})`,
                  height: '100%'
                }}
              >
                {renderItem}
              </div>
            )
          })}
        </animated.div>
      </div>
    </TransformCarouselContext.Provider>
  )

  return {
    carouselFragment,
    thumbsFragment,
    ...contextProps
  }
}
