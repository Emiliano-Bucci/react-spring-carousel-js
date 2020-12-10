import React, { useRef } from 'react'
import { useSpring, animated, SpringConfig } from 'react-spring'
import { InternalThumbsWrapper } from './index.styles'
import { useMount } from './index.utils'
import {
  CarouselProps,
  ReactSpringCarouselItem,
  SlideToItemFnProps
} from './types'

type Props<T extends ReactSpringCarouselItem> = {
  items: T[]
  withThumbs: boolean
  CustomThumbsWrapper: CarouselProps<T>['CustomThumbsWrapper']
  thumbsSlideAxis: CarouselProps<T>['thumbsSlideAxis']
  thumbsMaxHeight: CarouselProps<T>['thumbsMaxHeight']
  springConfig: SpringConfig
  getCurrentActiveItem(): number
  slideToItem(props: SlideToItemFnProps): void
}

export function useCarouselThumbs<T extends ReactSpringCarouselItem>({
  items,
  withThumbs,
  CustomThumbsWrapper,
  thumbsSlideAxis = 'x',
  thumbsMaxHeight = 0,
  springConfig,
  getCurrentActiveItem,
  slideToItem
}: Props<T>) {
  const thumbsWrapperRef = useRef<HTMLDivElement | null>(null)
  // @ts-ignore
  const [thumbWrapperScrollStyles, setThumbWrapperScrollStyles] = useSpring(
    () => ({
      [thumbsSlideAxis]: 0,
      config: springConfig
    })
  )

  useMount(() => {
    if (withThumbs) {
      const missingThumbs = items.some((item) => !item.renderThumb)

      if (missingThumbs) {
        throw new Error(
          'The renderThumb property is missing in one or more items. You need to add the renderThumb property to every item of the carousel when withThumbs={true}'
        )
      }
    }

    if (!withThumbs && !!CustomThumbsWrapper) {
      console.warn(
        "You set withThumbs={false} but you're still passing a <CustomThumbsWrapper /> component."
      )
    }

    if (thumbsSlideAxis === 'y' && thumbsMaxHeight === 0) {
      console.warn(
        'When you set thumbsSlideAxis=`y` remember also to set a truthy thumbsMaxHeight value.'
      )
    }

    if (thumbsSlideAxis === 'x' && thumbsMaxHeight > 0) {
      console.warn(
        "There's no need to specify a thumbsMaxHeight value when thumbsSlideAxis=`x`; the value will be omitted."
      )
    }
  })

  function handleThumbsScroll() {
    console.log(getCurrentActiveItem())

    const currentThumbItemNode = document.getElementById(
      `thumb-${items[getCurrentActiveItem()].id}`
    )

    if (currentThumbItemNode) {
      const offsetDirection =
        thumbsSlideAxis === 'x' ? 'offsetLeft' : 'offsetTop'
      const offsetDimension =
        thumbsSlideAxis === 'x' ? 'offsetWidth' : 'offsetHeight'
      const dimension = thumbsSlideAxis === 'x' ? 'width' : 'height'
      const scrollDirection =
        thumbsSlideAxis === 'x' ? 'scrollLeft' : 'scrollTop'

      const thumbOffsetPosition =
        currentThumbItemNode[offsetDirection] +
        currentThumbItemNode[offsetDimension] / 2
      const thumbScrollDimension =
        thumbsWrapperRef.current!.getBoundingClientRect()[dimension] / 2

      setThumbWrapperScrollStyles({
        from: {
          [thumbsSlideAxis]: thumbsWrapperRef.current![scrollDirection]
        },
        to: {
          [thumbsSlideAxis]: thumbOffsetPosition - thumbScrollDimension
        }
      })
    }
  }

  function getThumbsScrollDirection() {
    if (thumbsSlideAxis === 'x') {
      return {
        scrollLeft: thumbWrapperScrollStyles.x
      }
    }

    return {
      scrollTop: thumbWrapperScrollStyles.y
    }
  }

  const ThumbsWrapper = CustomThumbsWrapper || InternalThumbsWrapper
  const thumbsFragment = withThumbs ? (
    <ThumbsWrapper>
      <animated.div
        {...getThumbsScrollDirection()}
        ref={thumbsWrapperRef}
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: thumbsSlideAxis === 'x' ? 'row' : 'column',
          ...(thumbsSlideAxis === 'x'
            ? { overflowX: 'auto' }
            : { overflowY: 'auto', maxHeight: thumbsMaxHeight })
        }}
      >
        {items.map((item, index) => {
          const thumbId = `thumb-${item.id}`

          return (
            <div
              key={thumbId}
              id={thumbId}
              onClick={() => slideToItem({ item: index })}
            >
              {item.renderThumb}
            </div>
          )
        })}
      </animated.div>
    </ThumbsWrapper>
  ) : null

  return {
    thumbsFragment,
    handleThumbsScroll
  }
}
