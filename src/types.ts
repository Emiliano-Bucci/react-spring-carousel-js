import { SpringConfig, TransitionFrom, TransitionTo } from 'react-spring'

export type ReactSpringThumbItem = {
  id: string
  renderThumb: React.ReactNode
}

export type ReactSpringCarouselItem = {
  id: string
  renderItem: React.ReactNode
  renderThumb: React.ReactNode
}

type ItemWithThumb = {
  withThumbs: true
  items: ReactSpringCarouselItem[]
  enableThumbsWrapperScroll?: boolean
  prepareThumbsData?: PrepareThumbsData
  thumbsWrapperRef?: React.MutableRefObject<HTMLDivElement | null>
}
type ItemWithNoThumb = {
  withThumbs?: false
  enableThumbsWrapperScroll?: never
  prepareThumbsData?: never
  thumbsWrapperRef?: never
  items: {
    id: string
    renderItem: React.ReactNode
    renderThumb?: never
  }[]
}

export type UseSpringCarouselItems = ItemWithThumb | ItemWithNoThumb

export type BaseCarouselSharedProps = {
  withLoop?: boolean
  disableGestures?: boolean
  draggingSlideTreshold?: number
  springConfig?: SpringConfig
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
type UseSpringCarouselFluidType = {
  itemsPerSlide?: 'fluid'
  slideAmount?: number
  initialStartingPosition?: never
}
type UseSpringCarouselNumericSlideType = {
  itemsPerSlide?: number
  slideAmount?: never
  initialStartingPosition?: 'start' | 'center' | 'end'
}

export type UseSpringCarouselProps = Omit<BaseCarouselSharedProps, 'withLoop'> & {
  shouldResizeOnWindowResize?: boolean
  carouselSlideAxis?: 'x' | 'y'
  initialActiveItem?: number
  gutter?: number
  touchAction?: 'none' | 'pan'
} & (UseSpringCarouselLoopProps | UseSpringCarouselNoLoopProps) &
  (UseSpringCarouselFluidType | UseSpringCarouselNumericSlideType) &
  UseSpringCarouselItems

export type PrepareThumbsData = (items: ReactSpringThumbItem[]) => ReactSpringThumbItem[]

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

export type UseTransitionCarouselProps = BaseCarouselSharedProps &
  UseSpringCarouselItems & {
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

export type ObservableCallbackFn = (data: EventsObservableProps) => void

export type UseListenToCustomEvent = (fn: ObservableCallbackFn) => void
