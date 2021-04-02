import { useRef, MutableRefObject, useEffect } from 'react'
import { prepareDataForCustomEvent } from '../index.utils'
import screenfull from 'screenfull'
import { EmitCustomEvent, OnFullscreenChange } from '..'

type FullscreenModule = {
  mainCarouselWrapperRef: MutableRefObject<HTMLDivElement | null>
  emitCustomEvent: EmitCustomEvent
  handleResize?(): void
}

export function useFullscreenModule({
  mainCarouselWrapperRef,
  emitCustomEvent,
  handleResize
}: FullscreenModule) {
  const isFullscreen = useRef(false)

  useEffect(() => {
    function handleFullscreenChange() {
      if (document.fullscreenElement) {
        setIsFullscreen(true)
        emitCustomEvent(
          'onFullscreenChange',
          prepareDataForCustomEvent<OnFullscreenChange>({
            isFullscreen: true
          })
        )

        handleResize && handleResize()
      }

      if (!document.fullscreenElement) {
        setIsFullscreen(false)
        emitCustomEvent(
          'onFullscreenChange',
          prepareDataForCustomEvent<OnFullscreenChange>({
            isFullscreen: false
          })
        )
        handleResize && handleResize()
      }
    }

    if (screenfull.isEnabled) {
      screenfull.on('change', handleFullscreenChange)

      return () => {
        if (screenfull.isEnabled) {
          screenfull.off('change', handleFullscreenChange)
        }
      }
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
    }
  }

  function exitFullscreen() {
    screenfull.isEnabled && screenfull.exit()
  }

  return {
    enterFullscreen,
    exitFullscreen,
    getIsFullscreen
  }
}
