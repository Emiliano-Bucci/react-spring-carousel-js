import { SpringConfig, TransitionFrom, TransitionTo } from 'react-spring'
import { ObservableCallbackFn } from './events'

export type ReactSpringThumbItem = {
  id: string
  renderThumb: React.ReactNode
}

export type ReactSpringCarouselItem = {
  id: string
  renderItem: React.ReactNode
  renderThumb?: React.ReactNode
}

export type UseSpringCarouselProps = {
  withLoop?: boolean
  items: ReactSpringCarouselItem[]
  draggingSlideTreshold?: number
  springConfig?: SpringConfig
  shouldResizeOnWindowResize?: boolean
  withThumbs?: boolean
  enableThumbsWrapperScroll?: boolean
  carouselSlideAxis?: 'x' | 'y'
  thumbsSlideAxis?: 'x' | 'y'
  thumbsWrapperRef?: React.MutableRefObject<HTMLDivElement | null>
  itemsPerSlide?: number
  initialActiveItem?: number
  initialStartingPosition?: 'start' | 'center' | 'end'
  prepareThumbsData?: PrepareThumbsData
  disableGestures?: boolean
}

export type PrepareThumbsData = (
  items: ReactSpringThumbItem[]
) => ReactSpringThumbItem[]

export type UseSpringCarouselContextProps = {
  getIsFullscreen(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  slideToItem(item: string | number): void
  getIsAnimating(): boolean
  getIsDragging(): boolean
  getIsActiveItem(id: string): boolean
  enterFullscreen(elementRef?: HTMLElement): void
  exitFullscreen(): void
  slideToPrevItem(): void
  slideToNextItem(): void
  getCurrentActiveItem(): {
    id: string
    index: number
  }
  useListenToCustomEvent(fn: ObservableCallbackFn): void
}

export type SlideToItemFnProps = {
  from?: number
  item: number
  newIndex?: number
  immediate?: boolean
  onRest?(): void
}

export type SpringAnimationProps = {
  initial: TransitionFrom<ReactSpringCarouselItem>
  from: TransitionFrom<ReactSpringCarouselItem>
  enter: TransitionTo<ReactSpringCarouselItem>
  leave: TransitionTo<ReactSpringCarouselItem>
}

export type UseTransitionCarouselProps = {
  items: ReactSpringCarouselItem[]
  withThumbs?: boolean
  springConfig?: SpringConfig
  toPrevItemSpringProps?: SpringAnimationProps
  toNextItemSpringProps?: SpringAnimationProps
  springAnimationProps?: SpringAnimationProps
  withLoop?: boolean
  thumbsSlideAxis?: 'x' | 'y'
  thumbsMaxHeight?: number
  enableThumbsWrapperScroll?: boolean
  draggingSlideTreshold?: number
  prepareThumbsData?: PrepareThumbsData
  disableGestures?: boolean
}

export type UseTransitionCarouselContextProps = {
  activeItem: number
  slideToNextItem(): void
  slideToPrevItem(): void
  enterFullscreen(elementRef?: HTMLElement): void
  exitFullscreen(): void
  slideToItem(item: string | number): void
  getIsAnimating(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  useListenToCustomEvent(fn: ObservableCallbackFn): void
}
