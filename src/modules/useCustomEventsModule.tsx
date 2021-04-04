import { useEffect } from 'react'
import { Subject } from 'rxjs'
import {
  EventsObservableProps,
  ObservableCallbackFn,
  EmitObservableFn
} from '../types/events'

const eventsObserver = new Subject<EventsObservableProps>()

export function useCustomEventsModule() {
  function useListenToCustomEvent(fn: ObservableCallbackFn) {
    useEffect(() => {
      const subscribe = eventsObserver.subscribe(fn)
      return () => subscribe.unsubscribe()
    }, [fn])
  }

  const emitObservable: EmitObservableFn = (data) => {
    eventsObserver.next(data)
  }

  return {
    useListenToCustomEvent,
    emitObservable
  }
}
