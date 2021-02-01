import { SpringConfig, TransitionFrom, TransitionTo } from 'react-spring'
import { ListenToCustomEvent } from '.'

export type ReactSpringThumbItem = {
  id: string
  renderThumb: React.ReactNode
}

export type ReactSpringCarouselItem = {
  id: string
  renderItem: React.ReactNode
  renderThumb?: React.ReactNode
}

export type TransformCarouselProps = {
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
}

export type PrepareThumbsData = (
  items: ReactSpringThumbItem[]
) => ReactSpringThumbItem[]

export type TransformCarouselContextProps = {
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
  useListenToCustomEvent: ListenToCustomEvent
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

export type TransitionCarouselProps = {
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
}

export type TransitionCarouselContextProps = {
  activeItem: number
  slideToNextItem(): void
  slideToPrevItem(): void
  enterFullscreen(elementRef?: HTMLElement): void
  exitFullscreen(): void
  slideToItem(item: string | number): void
  getIsAnimating(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  useListenToCustomEvent: ListenToCustomEvent
}
