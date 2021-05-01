import { useEffect, useRef } from 'react'
import { Subject } from 'rxjs'
import {
  EventsObservableProps,
  ObservableCallbackFn,
  EmitObservableFn,
} from '../types'

export function useCustomEventsModule() {
  const eventsObserverRef = useRef(
    new Subject<EventsObservableProps>(),
  )

  function useListenToCustomEvent(fn: ObservableCallbackFn) {
    useEffect(() => {
      const subscribe = eventsObserverRef.current.subscribe(fn)
      return () => subscribe.unsubscribe()
    }, [fn])
  }

  const emitObservable: EmitObservableFn = data => {
    eventsObserverRef.current.next(data)
  }

  return {
    useListenToCustomEvent,
    emitObservable,
  }
}
