import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  forwardRef
} from 'react'
import { useSpring, config, SpringConfig, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import screenfull from 'screenfull'
import { useMount } from './index.utils'

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

type Item = {
  id: string
  renderItem: React.ReactNode
  renderThumb?: React.ReactNode
}

type CustomElement = React.ForwardRefExoticComponent<
  {
    children: React.ReactNode
  } & React.RefAttributes<HTMLDivElement>
>

type Props = {
  withLoop?: boolean
  items: Item[]
  draggingSlideTreshold?: number
  springConfig?: SpringConfig
  shouldResizeOnWindowResize?: boolean
  withTumbs?: boolean
  CustomWrapper?: CustomElement
  CustomThumbsWrapper?: React.FC<{ children: React.ReactNode }>
  enableThumbsWrapperScroll?: boolean
  onItemStartToChange?(): void
  onItemChange?(): void
}

type ReactSpringCarouselContextProps = {
  activeItem: number
  isFullscreen: boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  slideToItem(item: number, callback?: VoidFunction): void
  getIsAnimating(): boolean
  getIsDragging(): boolean
  getIsActiveItem(id: string): boolean
  enterFullscreen(): void
  exitFullscreen(): void
  slideToPrevItem(): void
  slideToNextItem(): void
}

export const ReactSpringCarouselContext = createContext<ReactSpringCarouselContextProps>(
  {
    activeItem: 0,
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
    slideToNextItem: () => {}
  }
)

export function useReactSpringCarousel({
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
}: Props) {
  const internalItems = withLoop
    ? [items[items.length - 1], ...items, items[0]]
    : items
  const [activeItem, setActiveItem] = useState(0)
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
  const [thumbWrapperScrollStyles, setThumbWrapperScrollStyles] = useSpring(
    () => ({
      x: 0,
      config: springConfig
    })
  )
  const bindDrag = useDrag(({ dragging, last, movement: [mx] }) => {
    const currentSlidedValue = -(getCarouselWrapperWidth() * activeItem)

    if (isAnimating.current) {
      return
    }

    if (dragging) {
      setCarouselStyles({ x: currentSlidedValue + mx })
      isDragging.current = true
    }

    if (last) {
      const prevItemTreshold = mx > draggingSlideTreshold
      const nextItemTreshold = mx < -draggingSlideTreshold

      if (nextItemTreshold) {
        if (!withLoop && activeItem === internalItems.length - 1) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          slideToNextItem()
        }
      } else if (prevItemTreshold) {
        if (!withLoop && activeItem === 0) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          slideToPrevItem()
        }
      } else {
        setCarouselStyles({ x: currentSlidedValue })
      }
    }
  })

  useMount(() => {
    if (withTumbs) {
      const missingThumbs = items.some((item) => !item.renderThumb)

      if (missingThumbs) {
        throw new Error(
          'The renderThumb property is missing in one or more items. You need to add the renderThumb property to every item of the carousel when withThumbs prop is true.'
        )
      }
    }
  })

  useEffect(() => {
    if (enableThumbsWrapperScroll) {
      const currentThumbItemNode = document.getElementById(
        `thumb-${items[activeItem].id}`
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
        x: -(getCarouselWrapperWidth() * activeItem),
        immediate: true
      })
      carouselWrapperRef.current!.style.left = `-${getCarouselWrapperWidth()}px`
    }

    if (shouldResizeOnWindowResize) {
      window.addEventListener('resize', handleResize)

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [activeItem, setCarouselStyles, shouldResizeOnWindowResize])

  function handleEnterFullscreen(element: HTMLDivElement) {
    if (screenfull.isEnabled) {
      screenfull.request(element)
    }
  }

  function exitFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.exit()
    }
  }

  function getPrevItem() {
    return activeItem - 1
  }

  function getNextItem() {
    return activeItem + 1
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
    if (!immediate) {
      setActiveItem(item)
    }

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
      }
    })
  }

  function slideToPrevItem() {
    if (
      (!withLoop && activeItem === 0) ||
      (isDragging.current && isAnimating.current)
    ) {
      return
    }

    onItemStartToChange()

    if (withLoop && activeItem === 0) {
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
      (!withLoop && activeItem === internalItems.length - 1) ||
      (isDragging.current && isAnimating.current)
    ) {
      return
    }

    onItemStartToChange()

    if (withLoop && activeItem === internalItems.length - 3) {
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

  function enterFullscreen() {
    handleEnterFullscreen(mainCarouselWrapperRef.current!)
  }

  function getIsAnimating() {
    return isAnimating.current
  }

  function getIsDragging() {
    return isDragging.current
  }

  function findItemIndex(id: string) {
    return items.findIndex((item) => item.id === id)
  }

  function getIsNextItem(id: string) {
    const itemIndex = findItemIndex(id)
    return itemIndex - 1 === activeItem
  }

  function getIsPrevItem(id: string) {
    const itemIndex = findItemIndex(id)
    return itemIndex - 1 === activeItem - 2
  }

  function getIsActiveItem(id: string) {
    const itemIndex = findItemIndex(id)
    return itemIndex === activeItem
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
    activeItem,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    getIsAnimating,
    getIsDragging,
    getIsNextItem,
    getIsPrevItem,
    getIsActiveItem,
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
