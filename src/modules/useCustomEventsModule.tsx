import { useEffect } from 'react'
import { EmitCustomEvent, ListenToCustomEvent } from '../types'

export function useCustomEventsModule() {
  const targetElement =
    typeof window !== 'undefined' ? document.createElement('div') : null

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
    if (targetElement) {
      const event = new CustomEvent(eventName, data)
      targetElement.dispatchEvent(event)
    }
  }

  return {
    emitCustomEvent,
    useListenToCustomEvent
  }
}
