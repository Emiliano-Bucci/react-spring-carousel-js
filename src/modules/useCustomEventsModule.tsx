import { useEffect } from 'react'
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
  const targetElement = document?.createElement('div')

  const useListenToCustomEvent: ListenToCustomEvent = (
    eventName,
    eventHandler
  ) => {
    // @ts-ignore
    useEffect(() => {
      function handleEvent(event: CustomEvent) {
        eventHandler(event.detail)
      }

      if (targetElement) {
        targetElement.addEventListener(eventName, handleEvent, false)

        return () => {
          targetElement.removeEventListener(eventName, handleEvent, false)
        }
      }
    })
  }

  const emitCustomEvent: EmitCustomEvent = (eventName, data) => {
    const event = new CustomEvent(eventName, data)
    targetElement.dispatchEvent(event)
  }

  return {
    emitCustomEvent,
    useListenToCustomEvent
  }
}
