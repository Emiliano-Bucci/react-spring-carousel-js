import { useRef, useEffect } from 'react'

export function useMount(callback: () => void) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      callback()
      isMounted.current = true
    }
  }, [callback])
}

enum ReactSpringCustomEvents {
  'RCSJS:onSlideStartChange' = 'RCSJS:onSlideStartChange',
  'RCSJS:onSlideChange' = 'RCSJS:onSlideChange'
}

export function useCustomEventListener<U>() {
  const targetElement = useRef(document.createElement('div'))

  function useListenToCustomEvent(
    eventName: ReactSpringCustomEvents,
    eventHandler: (data?: U) => void
  ) {
    useEffect(() => {
      const elementRef = targetElement.current

      function handleEvent(event: CustomEvent) {
        eventHandler(event.detail)
      }

      elementRef.addEventListener(eventName, handleEvent, false)

      return () => {
        elementRef.removeEventListener(eventName, handleEvent, false)
      }
    })
  }

  function emitCustomEvent<T>(
    eventName: ReactSpringCustomEvents,
    element: HTMLDivElement,
    data?: T
  ) {
    const event = new CustomEvent(eventName, data)
    element.dispatchEvent(event)
  }

  return {
    emitCustomEvent,
    useListenToCustomEvent
  }
}
