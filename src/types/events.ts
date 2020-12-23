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
  prevItem: number
  currentItem: number
  nextItem: number
}
export type OnSlideChange = {
  prevItem: number
  currentItem: number
  nextItem: number
}

export type OnDrag = Omit<FullGestureState<StateKey<GestureKey>>, 'event'> & {
  event: EventTypes['drag']
}

export type OnFullscreenChange = {
  isFullscreen: boolean
}

export type ListenToCustomEvent = <T>(
  eventName: keyof typeof ReactSpringCustomEvents,
  eventHandler: (data?: T | undefined) => void
) => void

export type EmitCustomEvent = <T>(
  eventName: keyof typeof ReactSpringCustomEvents,
  data?: T | undefined
) => void
