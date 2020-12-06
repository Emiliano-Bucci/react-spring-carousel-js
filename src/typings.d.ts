import { SpringConfig } from 'react-spring'

export interface Item {
  id: string
  renderItem: React.ReactNode
}

export interface Props<T extends Item> {
  withLoop?: boolean
  items: T[]
  draggingSlideTreshold?: number
  springConfig?: SpringConfig
  shouldResizeOnWindowResize?: boolean
}

export interface ReactSpringCarouselContextProps {
  activeItem: number
  getIsPrevItem?(id: string): boolean
  getIsNextItem?(id: string): boolean
  slideToItem?(item: number, callback?: VoidFunction): void
  getIsAnimating?(): boolean
  getIsDragging?(): boolean
  getIsActiveItem?(id: string): boolean
}
