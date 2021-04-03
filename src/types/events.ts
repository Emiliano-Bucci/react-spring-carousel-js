import {
  EventTypes,
  FullGestureState,
  GestureKey,
  StateKey
} from 'react-use-gesture/dist/types'

export type SlideActionType = 'prev' | 'next'

type OnSlideStartChange = {
  eventName: 'onSlideStartChange'
  nextItem: number
  slideActionType: SlideActionType
}
type OnSlideChange = {
  eventName: 'onSlideChange'
  currentItem: number
  slideActionType: SlideActionType
}

type OnDrag = Omit<FullGestureState<StateKey<GestureKey>>, 'event'> & {
  eventName: 'onDrag'
  event: EventTypes['drag']
}

type OnFullscreenChange = {
  eventName: 'onFullscreenChange'
  isFullscreen: boolean
}

type OnLeftSwipe = {
  eventName: 'onLeftSwipe'
}

type OnRightSwipe = {
  eventName: 'onRightSwipe'
}

export type EmitObservableFn = (
  data:
    | OnSlideStartChange
    | OnSlideChange
    | OnDrag
    | OnFullscreenChange
    | OnLeftSwipe
    | OnRightSwipe
) => void

export type EventsObservableProps =
  | OnSlideStartChange
  | OnSlideChange
  | OnDrag
  | OnFullscreenChange
  | OnLeftSwipe
  | OnRightSwipe

export type ObservableCallbackFn = (data: EventsObservableProps) => void
