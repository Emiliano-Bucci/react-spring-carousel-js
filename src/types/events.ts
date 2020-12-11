import {
  EventTypes,
  FullGestureState,
  GestureKey,
  StateKey
} from 'react-use-gesture/dist/types'

export enum ReactSpringCustomEvents {
  'RCSJS:onSlideStartChange' = 'RCSJS:onSlideStartChange',
  'RCSJS:onSlideChange' = 'RCSJS:onSlideChange',
  'RCSJS:onDrag' = 'RCSJS:onDrag',
  'RCSJS:onFullscreenChange' = 'RCSJS:onFullscreenChange'
}

export type RCSJSOnSlideStartChange = {
  prevItem: number
  currentItem: number
  nextItem: number
}
export type RCSJSOnSlideChange = {
  prevItem: number
  currentItem: number
  nextItem: number
}

export type RCSJSOnDrag = Omit<
  FullGestureState<StateKey<GestureKey>>,
  'event'
> & {
  event: EventTypes['drag']
}

export type RCSJOnFullscreenChange = {
  isFullscreen: boolean
}
