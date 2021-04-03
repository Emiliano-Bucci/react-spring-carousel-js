import { Subject } from 'rxjs'
import { useMount } from '../index.utils'
import {
  EventsObservableProps,
  ObservableCallbackFn,
  EmitObservableFn
} from '../types/events'

const eventsObserver = new Subject<EventsObservableProps>()

export function useCustomEventsModule() {
  function useListenToCustomEvent(fn: ObservableCallbackFn) {
    useMount(() => {
      const subscribe = eventsObserver.subscribe(fn)
      return () => subscribe.unsubscribe()
    })
  }

  const emitObservable: EmitObservableFn = (data) => {
    eventsObserver.next(data)
  }

  return {
    useListenToCustomEvent,
    emitObservable
  }
}
