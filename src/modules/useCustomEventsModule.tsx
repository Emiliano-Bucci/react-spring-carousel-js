import { useRef, useEffect } from 'react'
import { ReactSpringCustomEvents } from '../types'

export type ListenToCustomEvent = <U>(
  eventName: ReactSpringCustomEvents,
  eventHandler: (data?: U | undefined) => void
) => void

export type EmitCustomEvent = <T>(
  eventName: ReactSpringCustomEvents,
  data?: T | undefined
) => void

export function useCustomEventsModule() {
  const targetElement = useRef(document.createElement('div'))

  const useListenToCustomEvent: ListenToCustomEvent = (
    eventName,
    eventHandler
  ) => {
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

  const emitCustomEvent: EmitCustomEvent = (eventName, data) => {
    const event = new CustomEvent(eventName, data)
    targetElement.current.dispatchEvent(event)
  }

  return {
    emitCustomEvent,
    useListenToCustomEvent
  }
}
