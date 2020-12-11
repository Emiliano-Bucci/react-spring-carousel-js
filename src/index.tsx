import React, { createContext, useRef } from 'react'
import { prepareDataForCustomEvent, useMount } from './index.utils'
import {
  RCSJOnFullscreenChange,
  ReactSpringCarouselContextProps,
  ReactSpringCarouselItem,
  ReactSpringCustomEvents
} from './types'
import screenfull from 'screenfull'
import {
  AnimationModuleProps,
  useAnimationModules
} from './animationModules/AnimationModule'

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

export function useReactSpringCarousel<T extends ReactSpringCarouselItem>({
  type = 'transform',
  ...restProps
}: AnimationModuleProps<T>) {
  const isFullscreen = useRef(false)

  const {
    internalCarouselFragment,
    emitCustomEvent,
    getCurrentActiveItem,
    getIsAnimating,
    getIsDragging,
    getPrevItem,
    getNextItem,
    findItemIndex,
    slideToPrevItem,
    slideToNextItem,
    mainCarouselWrapperRef,
    useListenToCustomEvent,
    slideToItem,
    ...rest
  } = useAnimationModules({
    type,
    ...restProps
  })

  function getIsFullscreen() {
    return isFullscreen.current
  }

  function setIsFullscreen(_isFullscreen: boolean) {
    isFullscreen.current = _isFullscreen
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
      {internalCarouselFragment}
    </ReactSpringCarouselContext.Provider>
  )

  return {
    carouselFragment,
    ...contextProps,
    ...rest
  }
}

export * from './types'
