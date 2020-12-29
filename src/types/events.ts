import {
  EventTypes,
  FullGestureState,
  GestureKey,
  StateKey
} from 'react-use-gesture/dist/types'

export enum ReactSpringCustomEvents {
  'onSlideStartChange' = 'onSlideStartChange',
  'onSlideChange' = 'onSlideChange',
  'onDrag' = 'onDrag',
  'onFullscreenChange' = 'onFullscreenChange',
  'onLeftSwipe' = 'onLeftSwipe',
  'onRightSwipe' = 'onRightSwipe'
}

export type OnSlideStartChange = {
  nextItem: number
}
export type OnSlideChange = {
  currentItem: number
}

export type OnDrag = Omit<FullGestureState<StateKey<GestureKey>>, 'event'> & {
  event: EventTypes['drag']
}

export type OnFullscreenChange = {
  isFullscreen: boolean
}

export type ListenToCustomEvent = <T>(
  eventName: keyof typeof ReactSpringCustomEvents,
  eventHandler: (data: T) => void
) => void

export type EmitCustomEvent = <T>(
  eventName: keyof typeof ReactSpringCustomEvents,
  data?: T
) => void
