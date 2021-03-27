import { useRef } from 'react'
import { useMount } from '../index.utils'
import { EmitCustomEvent, ListenToCustomEvent } from '../types'

export function useCustomEventsModule() {
  const _targetElement = useRef(
    typeof window !== 'undefined' && document.createElement('div')
  )

  const useListenToCustomEvent: ListenToCustomEvent = (
    eventName,
    eventHandler
  ) => {
    useMount(() => {
      const targetElement = _targetElement.current

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
    if (_targetElement.current) {
      const event = new CustomEvent(eventName, data)
      _targetElement.current.dispatchEvent(event)
    }
  }

  return {
    emitCustomEvent,
    useListenToCustomEvent
  }
}
