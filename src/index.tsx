import React, {
  useState,
  useRef,
  createContext,
  useEffect,
  Fragment
} from 'react'
import { useSpring, config, SpringConfig } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import {
  Wrapper,
  CarouselWrapper,
  CarouselItemWrapper,
  InternalThumbsWrapper
} from './index.styles'
import screenfull from 'screenfull'

type Item = {
  id: string
  renderItem: React.ReactNode
  renderThumb: React.ReactNode
}

type Props = {
  withLoop?: boolean
  items: Item[]
  draggingSlideTreshold?: number
  springConfig?: SpringConfig
  shouldResizeOnWindowResize?: boolean
  withTumbs?: boolean
  removeSingleThumbWrapper?: boolean
  CustomThumbsWrapper?: React.FC<{ children: React.ReactNode }>
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
    exitFullscreen: () => {}
  }
)

export function useReactSpringCarousel({
  items,
  withLoop = false,
  draggingSlideTreshold = 50,
  springConfig = config.default,
  shouldResizeOnWindowResize = true,
  removeSingleThumbWrapper = false,
  CustomThumbsWrapper,
  onItemStartToChange = () => {},
  onItemChange = () => {}
}: Props) {
  const internalItems = withLoop
    ? [items[items.length - 1], ...items, items[0]]
    : items
  const [activeItem, setActiveItem] = useState(0)
  const mainCarouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const carouselWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const isAnimating = useRef(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [carouselStyles, setCarouselStyles] = useSpring(() => ({
    x: 0,
    config: springConfig
  }))
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
          handleSlideToNextItem()
        }
      } else if (prevItemTreshold) {
        if (!withLoop && activeItem === 0) {
          setCarouselStyles({ x: currentSlidedValue })
        } else {
          handleSlideToPrevItem()
        }
      } else {
        setCarouselStyles({ x: currentSlidedValue })
      }
    }
  })

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

  function handleSlideToPrevItem() {
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

  function handleSlideToNextItem() {
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

  const ThumbsWrapper = CustomThumbsWrapper || InternalThumbsWrapper

  const thumbs = (
    <ThumbsWrapper>
      {items.map((item, index) => {
        if (removeSingleThumbWrapper) {
          return (
            <Fragment key={`thumb-${item.id}`}>{item.renderThumb}</Fragment>
          )
        }

        return (
          <div
            key={`thumb-${item.id}`}
            onClick={() => slideToItem({ item: index })}
          >
            {item.renderThumb}
          </div>
        )
      })}
    </ThumbsWrapper>
  )

  const carouselFragment = (
    <ReactSpringCarouselContext.Provider
      value={{
        activeItem,
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        getIsAnimating,
        getIsDragging,
        getIsNextItem: (id) => {
          const itemIndex = items.findIndex((item) => item.id === id)
          return itemIndex - 1 === activeItem
        },
        getIsPrevItem: (id) => {
          const itemIndex = items.findIndex((item) => item.id === id)
          return itemIndex - 1 === activeItem - 2
        },
        getIsActiveItem: (id) => {
          const itemIndex = items.findIndex((item) => item.id === id)
          return itemIndex === activeItem
        },
        slideToItem: (item, callback) => {
          slideToItem({
            item,
            onRest: callback
          })
        }
      }}
    >
      <Wrapper ref={mainCarouselWrapperRef}>
        <div
          onClick={handleSlideToPrevItem}
          style={{
            position: 'relative',
            background: 'blue',
            zIndex: 100
          }}
        >
          prev item
        </div>
        <CarouselWrapper
          {...bindDrag()}
          style={carouselStyles}
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
            <CarouselItemWrapper key={`${id}-${index}`}>
              {renderItem}
            </CarouselItemWrapper>
          ))}
        </CarouselWrapper>
        <div
          style={{
            position: 'relative',
            background: 'blue',
            zIndex: 100
          }}
          onClick={handleSlideToNextItem}
        >
          next item
        </div>
      </Wrapper>
    </ReactSpringCarouselContext.Provider>
  )

  return {
    carouselFragment,
    thumbs,
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    getIsAnimating,
    getIsDragging,
    slideToItem
  }
}
