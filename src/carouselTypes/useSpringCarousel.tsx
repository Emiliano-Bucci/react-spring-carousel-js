import React, { useRef, createContext, useCallback } from 'react'
import { useSpring, config, animated, AnimationResult } from 'react-spring'
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
  OnDrag,
  OnSlideChange,
  OnSlideStartChange,
  TransformCarouselContextProps,
  SlideToItemFnProps,
  SlideActionType
} from '../types'

export const UseSpringCarouselContext = createContext<TransformCarouselContextProps>(
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
    useListenToCustomEvent: () => {},
    getCurrentActiveItem: () => ({
      id: '',
      index: 0
    })
  }
)

export function useSpringCarousel({
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
  initialActiveItem = 0,
  initialStartingPosition = 'start'
}: TransformCarouselProps) {
  function getRepeatedPrevItems() {
    const total = items.length
    return items.slice(total - itemsPerSlide - 1, total)
  }
  function getRepeatedNextItems() {
    return items.slice(0, itemsPerSlide + 1)
  }

  function getItems() {
    if (withLoop) {
      return [...getRepeatedPrevItems(), ...items, ...getRepeatedNextItems()]
    }

    return items
  }
  const slideActionType = useRef<SlideActionType>('next')
  const internalItems = getItems()
  const activeItem = useRef(initialActiveItem)
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
    emitCustomEvent,
    handleResize
  })
  const {
    thumbsFragment: _thumbsFragment,
    handleThumbsScroll
  } = useThumbsModule({
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
      setIsDragging(true)

      emitCustomEvent('onDrag', prepareDataForCustomEvent<OnDrag>(props))

      const prevItemTreshold = movement > draggingSlideTreshold
      const nextItemTreshold = movement < -draggingSlideTreshold

      if (nextItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === internalItems.length - 1) {
          setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
        } else {
          slideToNextItem()
        }
        props.cancel()
        setIsDragging(false)
      } else if (prevItemTreshold) {
        if (!withLoop && getCurrentActiveItem() === 0) {
          setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
        } else {
          slideToPrevItem()
        }
        props.cancel()
        setIsDragging(false)
      }
    }

    if (props.last && !getIsAnimating()) {
      setCarouselStyles({ [carouselSlideAxis]: currentSlidedValue })
    }
  })

  // Perform some check on first mount
  useMount(() => {
    if (itemsPerSlide > items.length) {
      throw new Error(
        `The itemsPerSlide prop can't be greater than the total length of the items you provide.`
      )
    }

    if (!shouldResizeOnWindowResize) {
      console.warn(
        'You set shouldResizeOnWindowResize={false}; be aware that the carousel could behave in a strange way if you also use the fullscreen functionality.'
      )
    }

    if (initialActiveItem < 0) {
      console.warn('The initialActiveItem cannot be less than 0.')
    }

    if (initialActiveItem > items.length) {
      console.warn(
        'The initialActiveItem cannot be greater than the total length of the items you provide.'
      )
    }
  })

  // @ts-ignore
  useMount(() => {
    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
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
  function handleResize() {
    setCarouselStyles({
      [carouselSlideAxis]: -(getSlideValue() * getCurrentActiveItem()),
      immediate: true
    })

    if (withLoop) {
      adjustCarouselWrapperPosition(carouselTrackWrapperRef.current!)
    }
  }
  function setSlideActionType(type: SlideActionType) {
    slideActionType.current = type
  }
  function getSlideActionType() {
    return slideActionType.current
  }
  function adjustCarouselWrapperPosition(ref: HTMLDivElement) {
    const positionProperty = carouselSlideAxis === 'x' ? 'left' : 'top'

    switch (initialStartingPosition) {
      default:
      case 'start': {
        ref.style[positionProperty] = `-${
          getSlideValue() * itemsPerSlide + getSlideValue()
        }px`
        break
      }

      case 'center': {
        ref.style[positionProperty] = `-${
          getSlideValue() * Math.floor(itemsPerSlide / 1.5) + getSlideValue()
        }px`
        break
      }

      case 'end': {
        ref.style[positionProperty] = `-${
          getSlideValue() * Math.floor(itemsPerSlide / 3) + getSlideValue()
        }px`
        break
      }
    }
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
  function setIsAnimating(val: boolean) {
    isAnimating.current = val
  }
  function setIsDragging(val: boolean) {
    isDragging.current = val
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
    from,
    item,
    immediate = false,
    onRest = () => {}
  }: SlideToItemFnProps) {
    const nextItemIndex = fixNegativeIndex(item, items.length)

    if (!immediate) {
      setActiveItem(nextItemIndex)
      emitCustomEvent(
        'onSlideStartChange',
        prepareDataForCustomEvent<OnSlideStartChange>({
          nextItem: nextItemIndex,
          slideActionType: getSlideActionType()
        })
      )
    }

    setIsAnimating(true)
    setCarouselStyles({
      ...(from
        ? {
            from: {
              [carouselSlideAxis]: from
            }
          }
        : {}),
      to: {
        [carouselSlideAxis]: -(getSlideValue() * item)
      },
      config: {
        ...springConfig
      },
      immediate,
      onRest: (val: AnimationResult) => {
        if (val.finished) {
          setIsDragging(false)
          setIsAnimating(false)
          onRest()

          if (!immediate) {
            emitCustomEvent(
              'onSlideChange',
              prepareDataForCustomEvent<OnSlideChange>({
                currentItem: getCurrentActiveItem(),
                slideActionType: getSlideActionType()
              })
            )
          }
        }
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

    setSlideActionType('prev')

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

        slideToItem({
          from: -(Math.abs(fromValue) + getSlideValue() * items.length),
          item: items.length - 1
        })
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

    setSlideActionType('next')

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
        slideToItem({
          from:
            getWrapperFromValue(carouselTrackWrapperRef.current!) +
            getSlideValue() * items.length,
          item: 0
        })
      }
    } else {
      slideToItem({
        item: getNextItem()
      })
    }
  }
  function _slideToItem(item: number) {
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

    if (itemIndex === getCurrentActiveItem()) {
      return
    }

    const currentItem = findItemIndex(items[getCurrentActiveItem()].id)
    const newActiveItem = findItemIndex(items[itemIndex].id)

    if (newActiveItem > currentItem) {
      setSlideActionType('next')
    } else {
      setSlideActionType('prev')
    }

    slideToItem({
      item: itemIndex
    })
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
    slideToItem: _slideToItem,
    getCurrentActiveItem: () => ({
      id: items[getCurrentActiveItem()].id,
      index: getCurrentActiveItem()
    })
  }

  const carouselFragment = (
    <UseSpringCarouselContext.Provider value={contextProps}>
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
            position: 'relative',
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
                  position: 'relative'
                }}
              >
                {renderItem}
              </div>
            )
          })}
        </animated.div>
      </div>
    </UseSpringCarouselContext.Provider>
  )

  const thumbsFragment = (
    <UseSpringCarouselContext.Provider value={contextProps}>
      {_thumbsFragment}
    </UseSpringCarouselContext.Provider>
  )

  return {
    carouselFragment,
    thumbsFragment,
    ...contextProps
  }
}
