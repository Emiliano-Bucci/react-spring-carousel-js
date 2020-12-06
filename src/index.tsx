import React, { useState, useRef, createContext, useEffect } from 'react'
import { useSpring, config } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import { Wrapper, CarouselWrapper, CarouselItemWrapper } from './index.styles'
import {
  Item,
  Props,
  ReactSpringCarouselContextProps as ContextProps
} from './typings'
import screenfull from 'screenfull'

export const ReactSpringCarouselContext = createContext<ContextProps>({
  activeItem: 0
})

export function ReactSpringCarousel<T extends Item>({
  items,
  withLoop = false,
  draggingSlideTreshold = 50,
  springConfig = config.default,
  shouldResizeOnWindowResize = true
}: Props<T>) {
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
    mainCarouselWrapperRef.current!.addEventListener(
      'fullscreenchange',
      (event) => {
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
    )
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

  function handleExitFullscreen() {
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

  function handleGoToItem({
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

    if (withLoop && activeItem === 0) {
      if (isDragging.current) {
        handleGoToItem({
          item: getPrevItem(),
          onRest: () => {
            setActiveItem(internalItems.length - 3)
            handleGoToItem({
              item: internalItems.length - 3,
              immediate: true
            })
          }
        })
      } else {
        handleGoToItem({
          item: internalItems.length - 2,
          immediate: true,
          onRest: () => {
            handleGoToItem({
              item: internalItems.length - 3
            })
          }
        })
      }
      return
    }

    handleGoToItem({
      item: getPrevItem()
    })
  }

  function handleSlideToNextItem() {
    if (
      (!withLoop && activeItem === internalItems.length - 1) ||
      (isDragging.current && isAnimating.current)
    ) {
      return
    }

    if (withLoop && activeItem === internalItems.length - 3) {
      if (!isDragging.current) {
        handleGoToItem({
          item: -1,
          immediate: true,
          onRest: () => {
            handleGoToItem({
              item: 0
            })
          }
        })
      } else {
        handleGoToItem({
          item: getNextItem(),
          onRest: () => {
            setActiveItem(0)
            handleGoToItem({
              item: 0,
              immediate: true
            })
          }
        })
      }

      return
    }

    handleGoToItem({
      item: getNextItem()
    })
  }

  return (
    <ReactSpringCarouselContext.Provider
      value={{
        activeItem,
        isFullscreen,
        enableFullscreen: () => {
          handleEnterFullscreen(mainCarouselWrapperRef.current!)
        },
        disableFullscreen: handleExitFullscreen,
        getIsAnimating: () => isAnimating.current,
        getIsDragging: () => isDragging.current,
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
          handleGoToItem({
            item,
            onRest: callback
          })
        }
      }}
    >
      <Wrapper ref={mainCarouselWrapperRef}>
        <div
          style={{
            color: 'yellow',
            zIndex: 12321312
          }}
          onClick={() => handleEnterFullscreen(mainCarouselWrapperRef.current!)}
        >
          Enter FULLSCREEN
        </div>
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
        <div
          style={{
            color: 'yellow',
            zIndex: 12321312
          }}
          onClick={handleExitFullscreen}
        >
          EXIT FULLSCREEN
        </div>
      </Wrapper>
    </ReactSpringCarouselContext.Provider>
  )
}
