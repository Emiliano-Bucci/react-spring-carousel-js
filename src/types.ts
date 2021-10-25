import {
  SpringConfig,
  TransitionFrom,
  TransitionTo,
} from 'react-spring'

export type ReactSpringThumbItem = {
  id: string
  renderThumb: React.ReactNode
}

export type ReactSpringCarouselItem = {
  id: string
  renderItem: React.ReactNode
  renderThumb?: React.ReactNode
}

type BaseCarouselSharedProps = {
  withLoop?: boolean
  withThumbs?: boolean
  disableGestures?: boolean
  enableThumbsWrapperScroll?: boolean
  draggingSlideTreshold?: number
  prepareThumbsData?: PrepareThumbsData
  springConfig?: SpringConfig
  items: ReactSpringCarouselItem[]
  thumbsSlideAxis?: 'x' | 'y'
}

type UseSpringCarouselLoopProps = {
  withLoop?: true
  startEndGutter?: number
}
type UseSpringCarouselNoLoopProps = {
  withLoop?: false
  startEndGutter?: never
}

export type UseSpringCarouselProps = Omit<
  BaseCarouselSharedProps,
  'withLoop'
> & {
  shouldResizeOnWindowResize?: boolean
  carouselSlideAxis?: 'x' | 'y'
  thumbsWrapperRef?: React.MutableRefObject<HTMLDivElement | null>
  itemsPerSlide?: number | 'fluid'
  initialActiveItem?: number
  initialStartingPosition?: 'start' | 'center' | 'end'
  gutter?: number
  touchAction?: 'none' | 'pan'
} & (UseSpringCarouselLoopProps | UseSpringCarouselNoLoopProps)

export type PrepareThumbsData = (
  items: ReactSpringThumbItem[],
) => ReactSpringThumbItem[]

export type SlideToItemFnProps = {
  from?: number
  to: number
  newIndex?: number
  immediate?: boolean
  customTo?: number
  onRest?(): void
}

export type SpringAnimationProps = {
  initial: TransitionFrom<ReactSpringCarouselItem>
  from: TransitionFrom<ReactSpringCarouselItem>
  enter: TransitionTo<ReactSpringCarouselItem>
  leave: TransitionTo<ReactSpringCarouselItem>
}

export type UseTransitionCarouselProps = BaseCarouselSharedProps & {
  toPrevItemSpringProps?: SpringAnimationProps
  toNextItemSpringProps?: SpringAnimationProps
  springAnimationProps?: SpringAnimationProps
}

type BaseContextSharedProps = {
  getIsFullscreen(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  enterFullscreen(elementRef?: HTMLElement): void
  exitFullscreen(): void
  slideToNextItem(): void
  slideToPrevItem(): void
  getIsAnimating(): boolean
  slideToItem(item: string | number): void
  getIsActiveItem(id: string): boolean
  getCurrentActiveItem(): {
    id: string
    index: number
  }
  useListenToCustomEvent: UseListenToCustomEvent
}

export type UseSpringCarouselContextProps = BaseContextSharedProps & {
  getIsDragging(): boolean
}

export type UseTransitionCarouselContextProps = BaseContextSharedProps & {
  activeItem: number
}

import { FullGestureState } from '@use-gesture/react'

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

type OnDrag = Omit<FullGestureState<'drag'>, 'event'> & {
  eventName: 'onDrag'
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
    | OnRightSwipe,
) => void

export type EventsObservableProps =
  | OnSlideStartChange
  | OnSlideChange
  | OnDrag
  | OnFullscreenChange
  | OnLeftSwipe
  | OnRightSwipe

export type ObservableCallbackFn = (
  data: EventsObservableProps,
) => void

export type UseListenToCustomEvent = (
  fn: ObservableCallbackFn,
) => void
