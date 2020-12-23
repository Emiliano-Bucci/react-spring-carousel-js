import { useRef, MutableRefObject } from 'react'
import { prepareDataForCustomEvent, useMount } from '../index.utils'
import screenfull from 'screenfull'
import { EmitCustomEvent } from './useCustomEventsModule'
import { OnFullscreenChange } from '..'

type FullscreenModule = {
  mainCarouselWrapperRef: MutableRefObject<HTMLDivElement | null>
  emitCustomEvent: EmitCustomEvent
}

export function useFullscreenModule({
  mainCarouselWrapperRef,
  emitCustomEvent
}: FullscreenModule) {
  const isFullscreen = useRef(false)

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

  function setIsFullscreen(_isFullscreen: boolean) {
    isFullscreen.current = _isFullscreen
  }

  function getIsFullscreen() {
    return isFullscreen.current
  }

  function enterFullscreen(elementRef?: HTMLElement) {
    if (screenfull.isEnabled) {
      screenfull.request(
        (elementRef || mainCarouselWrapperRef.current) as Element
      )

      emitCustomEvent(
        'onFullscreenChange',
        prepareDataForCustomEvent<OnFullscreenChange>({
          isFullscreen: true
        })
      )
    }
  }

  function exitFullscreen() {
    screenfull.isEnabled && screenfull.exit()

    emitCustomEvent(
      'onFullscreenChange',
      prepareDataForCustomEvent<OnFullscreenChange>({
        isFullscreen: false
      })
    )
  }

  return {
    enterFullscreen,
    exitFullscreen,
    getIsFullscreen
  }
}
