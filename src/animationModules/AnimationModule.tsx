import {
  CarouselProps,
  ReactSpringCarouselItem,
  ReactSpringCustomEvents,
  SlideToItemFnProps
} from '../types'
import { useTransformAnimationModule } from './TransformAnimationModule'

export interface AnimationType {
  type?: 'transform' | 'fadeInOut'
}

export interface AnimationModuleProps<T extends ReactSpringCarouselItem>
  extends CarouselProps<T>,
    AnimationType {}

export type AnimationModuleReturnData = {
  internalCarouselFragment: JSX.Element
  thumbsFragment: JSX.Element | null
  findItemIndex(id: string): number
  getCurrentActiveItem(): number
  getIsAnimating(): boolean
  getIsDragging(): boolean
  getPrevItem(): number
  getNextItem(): number
  slideToPrevItem(): void
  slideToNextItem(): void
  mainCarouselWrapperRef: React.MutableRefObject<HTMLDivElement | null>
  emitCustomEvent<T>(
    eventName: ReactSpringCustomEvents,
    data?: T | undefined
  ): void
  useListenToCustomEvent<U>(
    eventName: ReactSpringCustomEvents,
    eventHandler: (data?: U | undefined) => void
  ): void
  slideToItem({ item, immediate, onRest }: SlideToItemFnProps): void
}

export function useAnimationModules<T extends ReactSpringCarouselItem>({
  type,
  ...rest
}: AnimationModuleProps<T>): AnimationModuleReturnData {
  switch (type) {
    default:
    case 'transform': {
      const data = useTransformAnimationModule(rest)
      return data
    }
  }
}
