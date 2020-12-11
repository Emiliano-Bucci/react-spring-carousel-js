import { SpringConfig } from 'react-spring'
import { ReactSpringCustomEvents } from '.'

export type ReactSpringCarouselItem = {
  id: string
  renderItem: React.ReactNode
  renderThumb?: React.ReactNode
}

export type TransformCarouselProps<T extends ReactSpringCarouselItem> = {
  withLoop?: boolean
  items: T[]
  draggingSlideTreshold?: number
  springConfig?: SpringConfig
  shouldResizeOnWindowResize?: boolean
  withThumbs?: boolean
  enableThumbsWrapperScroll?: boolean
  carouselSlideAxis?: 'x' | 'y'
  thumbsSlideAxis?: 'x' | 'y'
  thumbsWrapperRef?: React.MutableRefObject<HTMLDivElement | null>
  thumbsMaxHeight?: number
}

export type TransformCarouselContextProps = {
  getIsFullscreen(): boolean
  getIsPrevItem(id: string): boolean
  getIsNextItem(id: string): boolean
  slideToItem(item: number, callback?: VoidFunction): void
  getIsAnimating(): boolean
  getIsDragging(): boolean
  getIsActiveItem(id: string): boolean
  enterFullscreen<T extends HTMLElement>(elementRef?: T): void
  exitFullscreen(): void
  slideToPrevItem(): void
  slideToNextItem(): void
  useListenToCustomEvent<T>(
    eventName: ReactSpringCustomEvents,
    eventHandler: (data?: T) => void
  ): void
}

export type SlideToItemFnProps = {
  item: number
  newIndex?: number
  immediate?: boolean
  onRest?(): void
}
