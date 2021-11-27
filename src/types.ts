import { SpringConfig, TransitionFrom, TransitionTo } from 'react-spring'
import { FullGestureState } from '@use-gesture/react'
import { HTMLAttributes } from 'react'

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
}
type ItemWithNoThumb = {
  withThumbs?: false
  enableThumbsWrapperScroll?: never
  prepareThumbsData?: never
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
  CustomThumbsWrapperComponent?: React.FC<HTMLAttributes<HTMLElement>>
}

type UseSpringCarouselLoopProps = {
  withLoop: true
  startEndGutter?: number
  freeScroll?: never
}
type UseSpringCarouselNoLoopProps = {
  withLoop?: false
  startEndGutter?: never
  freeScroll?: boolean
}
export type UseSpringCarouselFluidType = {
  itemsPerSlide: 'fluid'
  slideAmount?: number
  initialStartingPosition?: never
  initialActiveItem?: never
  freeScroll?: boolean
}
type UseSpringCarouselNumericSlideType = {
  itemsPerSlide?: number
  slideAmount?: never
  initialStartingPosition?: 'start' | 'center' | 'end'
  initialActiveItem?: number
  freeScroll?: never
}

export type UseSpringCarouselProps = Omit<BaseCarouselSharedProps, 'withLoop'> & {
  shouldResizeOnWindowResize?: boolean
  carouselSlideAxis?: 'x' | 'y'
  gutter?: number
  touchAction?: 'none' | 'pan'
} & (UseSpringCarouselLoopProps | UseSpringCarouselNoLoopProps) &
  (UseSpringCarouselFluidType | UseSpringCarouselNumericSlideType) &
  UseSpringCarouselItems

export type PrepareThumbsData = (items: ReactSpringThumbItem[]) => ReactSpringThumbItem[]

export type SlideToItemFnProps = {
  from?: number
  to?: number
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

export type UseSpringFluidTypeReturnProps = {
  useListenToCustomEvent: UseListenToCustomEvent
  getIsFullscreen(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  enterFullscreen(elementRef?: HTMLElement): void
  exitFullscreen(): void
  slideToNextItem(): void
  slideToPrevItem(): void
  getIsAnimating(): boolean
  getIsDragging(): boolean
}
export type UseSpringDafaultTypeReturnProps = {
  useListenToCustomEvent: UseListenToCustomEvent
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
  getIsDragging(): boolean
  getCurrentActiveItem(): {
    id: string
    index: number
  }
}

export type UseTransitionCarouselContextProps = {
  useListenToCustomEvent: UseListenToCustomEvent
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
  activeItem: number
}

export type SlideActionType = 'initial' | 'prev' | 'next'

type OnSlideStartChange = {
  eventName: 'onSlideStartChange'
  slideActionType: SlideActionType
  nextItem: {
    index: number
    id: string
  }
}
type OnSlideChange = {
  eventName: 'onSlideChange'
  slideActionType: SlideActionType
  currentItem: {
    index: number
    id: string
  }
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
