import { useRef, useEffect } from 'react'
import { ReactSpringCustomEvents } from '.'

export function useMount(callback: () => void) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      callback()
      isMounted.current = true
    }
  }, [callback])
}

export function useCustomEventListener() {
  const targetElement = useRef(document.createElement('div'))

  function useListenToCustomEvent<U>(
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

  function emitCustomEvent<T>(eventName: ReactSpringCustomEvents, data?: T) {
    const event = new CustomEvent(eventName, data)
    targetElement.current.dispatchEvent(event)
  }

  return {
    emitCustomEvent,
    useListenToCustomEvent
  }
}

export function prepareDataForCustomEvent<T>(data: T) {
  return {
    detail: {
      ...data
    }
  }
}

export function fixNegativeIndex(index: number, totalItems: number) {
  if (index === -1) {
    return totalItems - 1
  }

  if (index >= totalItems) {
    return 0
  }

  return index
}
