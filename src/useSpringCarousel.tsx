import { useRef, createContext, useCallback, useContext, useEffect } from 'react'
import { useSpring, config, animated } from 'react-spring'
import { useDrag } from '@use-gesture/react'
import { useCustomEventsModule, useFullscreenModule, useThumbsModule } from './modules'
import {
  UseSpringCarouselProps,
  SlideToItemFnProps,
  SlideActionType,
  UseSpringDafaultTypeReturnProps,
  UseSpringFluidTypeReturnProps,
} from './types'
import { useMount } from './utils'
import { getIsBrowser } from './utils'

type ReturnHook<T> = T extends 'fluid'
  ? UseSpringFluidTypeReturnProps
  : UseSpringDafaultTypeReturnProps

const UseSpringCarouselContext = createContext<
  (UseSpringFluidTypeReturnProps | UseSpringDafaultTypeReturnProps) | undefined
>(undefined)

export default function useSpringCarousel<T>({
  itemsPerSlide = 1,
  items,
  withLoop = false,
  draggingSlideTreshold = 140,
  springConfig = config.default,
  shouldResizeOnWindowResize = true,
  withThumbs = false,
  enableThumbsWrapperScroll = true,
  carouselSlideAxis = 'x',
  thumbsWrapperRef,
  thumbsSlideAxis = 'x',
  prepareThumbsData,
  initialActiveItem = 0,
  initialStartingPosition = 'start',
  disableGestures = false,
  gutter = 0,
  startEndGutter = 0,
  touchAction = 'none',
  slideAmount,
}: UseSpringCarouselProps): ReturnHook<T> & {
  carouselFragment: JSX.Element
  thumbsFragment: JSX.Element
} {
  function getItems() {
    if (withLoop) {
      return [...items, ...items, ...items]
    }
    return items
  }
  const slideActionType = useRef<SlideActionType>('initial')
  const internalItems = getItems()
  const activeItem = useRef(initialActiveItem)
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselTrackWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const isAnimating = useRef(false)
  const windowIsHidden = useRef(false)
  const currentWindowWidth = useRef(0)
  const fluidTotalWrapperScrollValue = useRef(0)
  const slideFluidEndReached = useRef(false)
  const currentStepSlideValue = useRef(0)
  const initialWindowWidth = useRef(0)

  function getCarouselItem() {
    return carouselTrackWrapperRef.current?.querySelector('.use-spring-carousel-item')
  }
  const setCurrentStepSlidedValue = useCallback((val: number) => {
    currentStepSlideValue.current = val
  }, [])
  const getMainCarouselWrapperWidth = useCallback(() => {
    if (!mainCarouselWrapperRef.current) {
      throw new Error('mainCarouselWrapperRef is not available')
    }
    return mainCarouselWrapperRef.current.getBoundingClientRect()[
      carouselSlideAxis === 'x' ? 'width' : 'height'
    ]
  }, [carouselSlideAxis])
  const getCarouselItemWidth = useCallback(() => {
    const carouselItem = getCarouselItem()
    if (!carouselItem) {
      throw Error('No carousel items available!')
    }
    return (
      carouselItem.getBoundingClientRect()[
        carouselSlideAxis === 'x' ? 'width' : 'height'
      ] + gutter
    )
  }, [carouselSlideAxis, gutter])
  const getIfItemsNotFillTheCarousel = useCallback(() => {
    return getCarouselItemWidth() * items.length < getMainCarouselWrapperWidth()
  }, [getCarouselItemWidth, getMainCarouselWrapperWidth, items.length])
  const getFluidWrapperScrollValue = useCallback(() => {
    return Math.round(
      Number(
        carouselTrackWrapperRef.current?.[
          carouselSlideAxis === 'x' ? 'scrollWidth' : 'scrollHeight'
        ],
      ) -
        carouselTrackWrapperRef.current!.getBoundingClientRect()[
          carouselSlideAxis === 'x' ? 'width' : 'height'
        ],
    )
  }, [carouselSlideAxis])
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    y: 0,
    x: 0,
    config: springConfig,
    onRest: ({ value }) => {
      setCurrentStepSlidedValue(value[carouselSlideAxis])
    },
  }))
  const getIsFirstItem = useCallback(() => {
    return getCurrentActiveItem() === 0
  }, [])

  const getSlideValue = useCallback(() => {
    if (!carouselTrackWrapperRef.current) {
      return 0
    }
    const itemVal = getCarouselItemWidth()

    if (itemsPerSlide === 'fluid' && typeof slideAmount === 'number') {
      if (slideAmount < itemVal) {
        throw new Error('slideAmount must be greater than the width of a single item.')
      }
      return slideAmount
    }
    return itemVal
  }, [getCarouselItemWidth, itemsPerSlide, slideAmount])
  const adjustCarouselWrapperPosition = useCallback(
    (ref: HTMLDivElement) => {
      const positionProperty = carouselSlideAxis === 'x' ? 'left' : 'top'
      function getDefaultPositionValue() {
        return getCarouselItemWidth() * items.length
      }
      function setPosition(v: number) {
        ref.style.top = '0px'
        ref.style.left = '0px'
        ref.style[positionProperty] = `-${v - startEndGutter}px`
      }
      function setStartPosition() {
        setPosition(getDefaultPositionValue())
      }

      if (itemsPerSlide !== 'fluid' && typeof itemsPerSlide === 'number') {
        function setCenterPosition() {
          setPosition(
            getDefaultPositionValue() -
              getSlideValue() * Math.round(((itemsPerSlide as number) - 1) / 2),
          )
        }
        function setEndPosition() {
          setPosition(
            getDefaultPositionValue() -
              getSlideValue() * Math.round((itemsPerSlide as number) - 1),
          )
        }

        if (itemsPerSlide > 1) {
          switch (initialStartingPosition) {
            default:
            case 'start': {
              setStartPosition()
              break
            }
            case 'center': {
              setCenterPosition()
              break
            }
            case 'end': {
              setEndPosition()
              break
            }
          }
        } else {
          setStartPosition()
        }
      } else {
        setStartPosition()
      }
    },
    [
      carouselSlideAxis,
      itemsPerSlide,
      getCarouselItemWidth,
      items.length,
      startEndGutter,
      getSlideValue,
      initialStartingPosition,
    ],
  )
  const handleResize = useCallback(() => {
    if (window.innerWidth === currentWindowWidth.current) {
      return
    }
    currentWindowWidth.current = window.innerWidth

    if (itemsPerSlide === 'fluid') {
      if (getIfItemsNotFillTheCarousel()) {
        setCurrentStepSlidedValue(0)
        setCarouselStyles.start({
          immediate: true,
          [carouselSlideAxis]: 0,
        })
        return
      }
      fluidTotalWrapperScrollValue.current = getFluidWrapperScrollValue()
      const diff = currentWindowWidth.current - initialWindowWidth.current

      if (getIsFirstItem()) {
        setCurrentStepSlidedValue(0)
        setCarouselStyles.start({
          immediate: true,
          [carouselSlideAxis]: 0,
        })
      } else if (slideFluidEndReached.current) {
        const nextValue = -fluidTotalWrapperScrollValue.current
        setCurrentStepSlidedValue(nextValue)
        setCarouselStyles.start({
          immediate: true,
          [carouselSlideAxis]: nextValue,
        })
      } else {
        const nextValue = currentStepSlideValue.current + diff
        setCurrentStepSlidedValue(nextValue)
        setCarouselStyles.start({
          immediate: true,
          [carouselSlideAxis]: nextValue,
        })
      }

      initialWindowWidth.current = window.innerWidth
    } else {
      setCarouselStyles.start({
        immediate: true,
        x: 0,
        y: 0,
      })
      setCarouselStyles.start({
        immediate: true,
        [carouselSlideAxis]: -(getSlideValue() * getCurrentActiveItem()),
      })
    }
    if (withLoop) {
      adjustCarouselWrapperPosition(carouselTrackWrapperRef.current!)
    }
  }, [
    itemsPerSlide,
    withLoop,
    getIfItemsNotFillTheCarousel,
    getFluidWrapperScrollValue,
    getIsFirstItem,
    setCurrentStepSlidedValue,
    setCarouselStyles,
    carouselSlideAxis,
    getSlideValue,
    adjustCarouselWrapperPosition,
  ])
  // Custom modules
  const { useListenToCustomEvent, emitObservable } = useCustomEventsModule()
  const { enterFullscreen, exitFullscreen, getIsFullscreen } = useFullscreenModule({
    mainCarouselWrapperRef,
    emitObservable,
    handleResize,
  })
  const { thumbsFragment: _thumbsFragment, handleThumbsScroll } = useThumbsModule({
    withThumbs,
    items,
    thumbsSlideAxis,
    springConfig,
    thumbsWrapperRef,
    prepareThumbsData,
  })
  function getCurrentSlidedValue() {
    return carouselStyles[carouselSlideAxis].get()
  }

  const bindDrag = useDrag(
    props => {
      const isDragging = props.dragging
      const movement = props.movement[carouselSlideAxis === 'x' ? 0 : 1]
      function resetAnimation() {
        if (itemsPerSlide === 'fluid') {
          if (getIfItemsNotFillTheCarousel()) {
            setCarouselStyles.start({
              [carouselSlideAxis]: 0,
            })
          } else if (getIsFirstItem()) {
            slideToPrevItem()
          } else if (slideFluidEndReached.current) {
            setCarouselStyles.start({
              [carouselSlideAxis]: -fluidTotalWrapperScrollValue.current,
            })
          } else {
            setCarouselStyles.start({
              [carouselSlideAxis]: getCurrentSlidedValue(),
            })
          }
        } else {
          setCarouselStyles.start({
            [carouselSlideAxis]: -(getCurrentActiveItem() * getSlideValue()),
          })
        }
      }

      if (isDragging) {
        setIsDragging(true)
        emitObservable({
          eventName: 'onDrag',
          ...props,
        })

        setCarouselStyles.start({
          [carouselSlideAxis]: getCurrentSlidedValue() + movement,
        })

        const prevItemTreshold = movement > draggingSlideTreshold
        const nextItemTreshold = movement < -draggingSlideTreshold

        if (
          mainCarouselWrapperRef.current!.getBoundingClientRect().width >=
          items.length * getSlideValue()
        ) {
          slideFluidEndReached.current = true
        }

        if ((prevItemTreshold || nextItemTreshold) && getIfItemsNotFillTheCarousel()) {
          props.cancel()
          resetAnimation()
          return
        }

        if (slideFluidEndReached.current && movement < 0) {
          if (nextItemTreshold) {
            props.cancel()
            setCarouselStyles.start({
              [carouselSlideAxis]: -fluidTotalWrapperScrollValue.current,
            })
          }
        } else if (nextItemTreshold) {
          props.cancel()
          if (!withLoop && getIsLastItem()) {
            resetAnimation()
          } else {
            slideToNextItem()
          }
        } else if (prevItemTreshold) {
          props.cancel()
          if (!withLoop && getIsFirstItem()) {
            resetAnimation()
          } else {
            slideToPrevItem()
          }
        }
      }
      if (props.last && !props.pressed) {
        resetAnimation()
      }
    },
    {
      enabled: !disableGestures,
    },
  )

  // Perform some check on first mount
  useMount(() => {
    if (itemsPerSlide !== 'fluid' && !Number.isInteger(itemsPerSlide)) {
      throw new Error(`itemsPerSlide should be an integer.`)
    }
    if (itemsPerSlide > items.length) {
      throw new Error(
        `The itemsPerSlide prop can't be greater than the total length of the items you provide.`,
      )
    }
    if (itemsPerSlide < 1) {
      throw new Error(`The itemsPerSlide prop can't be less than 1.`)
    }
    if (!shouldResizeOnWindowResize) {
      console.warn(
        'You set shouldResizeOnWindowResize={false}; be aware that the carousel could behave in a strange way if you also use the fullscreen functionality or if you change the mobile orientation.',
      )
    }
    if (initialActiveItem < 0) {
      console.warn('The initialActiveItem cannot be less than 0.')
    }
    if (initialActiveItem > items.length) {
      console.warn(
        'The initialActiveItem cannot be greater than the total length of the items you provide.',
      )
    }
  })
  useMount(() => {
    fluidTotalWrapperScrollValue.current = getFluidWrapperScrollValue()
    function handleVisibilityChange() {
      if (document.hidden) {
        windowIsHidden.current = true
      } else {
        windowIsHidden.current = false
      }
    }
    if (getIsBrowser()) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  })
  useMount(() => {
    initialWindowWidth.current = window.innerWidth
    if (initialActiveItem > 0 && initialActiveItem <= items.length) {
      slideToItem({
        to: initialActiveItem,
        immediate: true,
      })
      setActiveItem(initialActiveItem)
    }
  })
  useEffect(() => {
    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [handleResize, shouldResizeOnWindowResize])
  useEffect(() => {
    if (carouselTrackWrapperRef.current) {
      if (carouselSlideAxis === 'x') {
        carouselTrackWrapperRef.current.style.top = '0px'
      }
      if (carouselSlideAxis === 'y') {
        carouselTrackWrapperRef.current.style.left = '0px'
      }
    }
  }, [carouselSlideAxis])

  function setSlideActionType(type: SlideActionType) {
    slideActionType.current = type
  }
  function getSlideActionType() {
    return slideActionType.current
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
    return items.findIndex(item => item.id === id)
  }
  function slideToItem({
    from,
    to,
    customTo,
    immediate = false,
    onRest = () => {},
  }: SlideToItemFnProps) {
    if (!immediate) {
      setActiveItem(to)
      setIsAnimating(true)
      emitObservable({
        eventName: 'onSlideStartChange',
        nextItem: to,
        slideActionType: getSlideActionType(),
      })
    }

    function getFromValue() {
      if (from) {
        return {
          from: {
            [carouselSlideAxis]: from,
          },
        }
      }
      return {}
    }
    function getToValue() {
      if (customTo) {
        return {
          [carouselSlideAxis]: customTo,
        }
      }
      return {
        [carouselSlideAxis]: -(getSlideValue() * to),
      }
    }

    setCurrentStepSlidedValue(getToValue()[carouselSlideAxis])
    setCarouselStyles.start({
      ...getFromValue(),
      to: getToValue(),
      immediate,
      onRest: val => {
        if (val.finished) {
          setIsDragging(false)
          setIsAnimating(false)
          onRest()
          if (!immediate) {
            emitObservable({
              eventName: 'onSlideChange',
              currentItem: getCurrentActiveItem(),
              slideActionType: getSlideActionType(),
            })
          }
        }
      },
    })
    if (enableThumbsWrapperScroll && withThumbs && !immediate) {
      handleThumbsScroll(to)
    }
  }
  function getIsLastItem() {
    return getCurrentActiveItem() === items.length - 1
  }
  function slideToPrevItem() {
    setSlideActionType('prev')

    if (itemsPerSlide === 'fluid') {
      if (getIfItemsNotFillTheCarousel()) {
        return
      }
      const nextPrevValue = getCurrentSlidedValue() + getCarouselItemWidth() - 200

      if (nextPrevValue >= 0) {
        if (withLoop) {
          slideToItem({
            to: items.length - 1,
            from: getCurrentSlidedValue() - getCarouselItemWidth() * items.length,
            customTo:
              getCurrentSlidedValue() -
              getCarouselItemWidth() * items.length +
              getSlideValue(),
          })
        } else {
          slideToItem({
            to: 0,
          })
        }
      } else {
        const nextValue = getCurrentSlidedValue() + getSlideValue()
        slideToItem({
          to: getPrevItem(),
          customTo: nextValue,
        })
      }
      if (slideFluidEndReached.current) {
        slideFluidEndReached.current = false
      }
    } else {
      if ((!withLoop && getCurrentActiveItem() === 0) || windowIsHidden.current) {
        return
      }

      if (getIsFirstItem()) {
        slideToItem({
          from: getCurrentSlidedValue() - getSlideValue() * items.length,
          to: items.length - 1,
        })
      } else {
        slideToItem({
          to: getPrevItem(),
        })
      }
    }
  }
  function slideToNextItem() {
    setSlideActionType('next')

    if (itemsPerSlide === 'fluid') {
      if (getIfItemsNotFillTheCarousel()) {
        return
      }
      const willGoAfterLastFluidItem =
        Math.abs(currentStepSlideValue.current - getSlideValue()) + 100 >=
        fluidTotalWrapperScrollValue.current

      if (
        withLoop &&
        Math.abs(getCurrentSlidedValue() - getSlideValue()) >=
          items.length * getCarouselItemWidth()
      ) {
        const currentWidth = getCarouselItemWidth() * items.length

        slideToItem({
          to: 0,
          from: getCurrentSlidedValue() + currentWidth,
          customTo: getCurrentSlidedValue() + currentWidth - getSlideValue(),
        })
      } else if (slideFluidEndReached.current) {
        return
      } else if (willGoAfterLastFluidItem) {
        const nextValue = -fluidTotalWrapperScrollValue.current
        slideFluidEndReached.current = true

        slideToItem({
          to: getNextItem(),
          customTo: nextValue,
        })
      } else {
        const nextValue = getCurrentSlidedValue() - getSlideValue()
        slideToItem({
          to: getNextItem(),
          customTo: nextValue,
        })
      }
    } else {
      if (
        (!withLoop && getCurrentActiveItem() === internalItems.length - 1) ||
        windowIsHidden.current
      ) {
        return
      }

      if (getIsLastItem()) {
        slideToItem({
          from: getCurrentSlidedValue() + getSlideValue() * items.length,
          to: 0,
        })
      } else {
        slideToItem({
          to: getNextItem(),
        })
      }
    }
  }
  function _slideToItem(item: string | number) {
    let itemIndex = 0

    if (typeof item === 'string') {
      itemIndex = items.findIndex(_item => _item.id === item)
    } else {
      itemIndex = item
    }

    if (itemIndex >= items.length) {
      throw Error(
        `The item you want to slide to doesn't exist. This could be due to the fact that 
        you provide a wrong id or a higher numeric index.`,
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
      to: itemIndex,
    })
  }

  const contextProps = {
    useListenToCustomEvent,
    getIsFullscreen,
    enterFullscreen,
    exitFullscreen,
    getIsAnimating,
    getIsDragging,
    getIsNextItem,
    getIsPrevItem,
    slideToPrevItem,
    slideToNextItem,
    ...(typeof itemsPerSlide === 'number'
      ? {
          slideToItem: _slideToItem,
          getIsActiveItem: (id: string) => {
            return findItemIndex(id) === getCurrentActiveItem()
          },
          getCurrentActiveItem: () => ({
            id: items[getCurrentActiveItem()].id,
            index: getCurrentActiveItem(),
          }),
        }
      : {}),
  }
  function getItemStyles() {
    if (typeof itemsPerSlide === 'number') {
      return {
        ...(carouselSlideAxis === 'x'
          ? { marginRight: `${gutter}px` }
          : { marginBottom: `${gutter}px` }),
        flex: `1 0 calc(100% / ${itemsPerSlide} - ${
          (gutter * (itemsPerSlide - 1)) / itemsPerSlide
        }px)`,
      }
    }
    return {
      ...(carouselSlideAxis === 'x'
        ? { marginRight: `${gutter}px` }
        : { marginBottom: `${gutter}px` }),
    }
  }
  function getAnimatedWrapperStyles() {
    const percentValue = `calc(100% - ${startEndGutter * 2}px)`
    return {
      width: carouselSlideAxis === 'x' ? percentValue : '100%',
      height: carouselSlideAxis === 'y' ? percentValue : '100%',
    }
  }
  function handleCarouselFragmentRef(ref: HTMLDivElement | null) {
    if (ref) {
      carouselTrackWrapperRef.current = ref
      if (withLoop) {
        adjustCarouselWrapperPosition(ref)
      }
    }
  }
  const carouselFragment = (
    <UseSpringCarouselContext.Provider value={contextProps}>
      <div
        ref={mainCarouselWrapperRef}
        data-testid="use-spring-carousel-wrapper"
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <animated.div
          {...bindDrag()}
          data-testid="use-spring-carousel-animated-wrapper"
          ref={handleCarouselFragmentRef}
          style={{
            display: 'flex',
            top: 0,
            left: 0,
            position: 'relative',
            touchAction,
            flexDirection: carouselSlideAxis === 'x' ? 'row' : 'column',
            ...getAnimatedWrapperStyles(),
            ...carouselStyles,
          }}
        >
          {internalItems.map(({ id, renderItem }, index) => {
            return (
              <div
                key={`${id}-${index}`}
                className="use-spring-carousel-item"
                data-testid="use-spring-carousel-item-wrapper"
                style={{
                  display: 'flex',
                  position: 'relative',
                  // ...(carouselSlideAxis === 'x'
                  //   ? { minWidth: '150px' }
                  //   : { minHeight: '150px' }),
                  ...getItemStyles(),
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
    ...(contextProps as ReturnHook<T>),
    carouselFragment,
    thumbsFragment,
  }
}

export function useSpringCarouselContext<T>() {
  const context = useContext(UseSpringCarouselContext)
  if (!context) {
    throw new Error(
      'useSpringCarouselContext must be used only inside a component that is rendered inside the Carousel.',
    )
  }
  return context as ReturnHook<T>
}
