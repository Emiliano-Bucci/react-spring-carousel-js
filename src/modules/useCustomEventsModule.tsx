import { useEffect } from 'react'
import { Subject } from 'rxjs'
import {
  EventsObservableProps,
  ObservableCallbackFn,
  EmitObservableFn,
} from '../types'

const eventsObserver = new Subject<EventsObservableProps>()

function useListenToCustomEvent(fn: ObservableCallbackFn) {
  useEffect(() => {
    const subscribe = eventsObserver.subscribe(fn)
    return () => subscribe.unsubscribe()
  }, [fn])
}

const emitObservable: EmitObservableFn = data => {
  eventsObserver.next(data)
}

export function useCustomEventsModule() {
  return {
    useListenToCustomEvent,
    emitObservable,
  }
}
