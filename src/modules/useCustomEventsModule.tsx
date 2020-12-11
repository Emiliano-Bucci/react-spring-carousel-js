import { useRef, useEffect } from 'react'
import { ReactSpringCustomEvents } from '../types'

export function useCustomEventsModule() {
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
