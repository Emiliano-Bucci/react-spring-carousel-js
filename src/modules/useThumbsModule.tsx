import React, { useRef } from 'react'
import { useSpring, SpringConfig } from 'react-spring'
import { fixNegativeIndex, useMount } from '../index.utils'
import {
  TransformCarouselProps,
  ReactSpringCarouselItem,
  SlideToItemFnProps
} from '../types'

type Props<T extends ReactSpringCarouselItem> = {
  items: T[]
  withThumbs: boolean
  thumbsSlideAxis: TransformCarouselProps<T>['thumbsSlideAxis']
  thumbsMaxHeight: TransformCarouselProps<T>['thumbsMaxHeight']
  thumbsWrapperRef?: TransformCarouselProps<T>['thumbsWrapperRef']
  springConfig: SpringConfig
  getCurrentActiveItem(): number
  slideToItem(props: SlideToItemFnProps): void
}

export function useThumbsModule<T extends ReactSpringCarouselItem>({
  items,
  withThumbs,
  thumbsSlideAxis = 'x',
  thumbsMaxHeight = 0,
  springConfig,
  getCurrentActiveItem,
  slideToItem,
  thumbsWrapperRef
}: Props<T>) {
  const internalThumbsWrapperRef = useRef<HTMLDivElement | null>(null)
  // @ts-ignore
  const [, setThumbListStyles] = useSpring(() => ({
    [thumbsSlideAxis]: 0,
    config: springConfig
  }))

  useMount(() => {
    if (withThumbs) {
      const missingThumbs = items.some((item) => !item.renderThumb)

      if (missingThumbs) {
        throw new Error(
          'The renderThumb property is missing in one or more items. You need to add the renderThumb property to every item of the carousel when withThumbs={true}'
        )
      }
    }

    if (thumbsSlideAxis === 'y' && thumbsMaxHeight === 0 && !thumbsWrapperRef) {
      console.warn(
        'When you set thumbsSlideAxis=`y` you would also probably set thumbsMaxHeight or thumbsWrapperRef props.'
      )
    }

    if (thumbsSlideAxis === 'x' && thumbsMaxHeight > 0) {
      console.warn(
        "There's no need to specify a thumbsMaxHeight value when thumbsSlideAxis=`x`; the value will be omitted."
      )
    }
  })

  function handleThumbsScroll() {
    if (thumbsWrapperRef && thumbsWrapperRef.current) {
      internalThumbsWrapperRef.current = thumbsWrapperRef.current
    }

    const currentThumbItemNode = document.getElementById(
      `thumb-${
        items[fixNegativeIndex(getCurrentActiveItem(), items.length)].id
      }`
    )

    if (currentThumbItemNode) {
      const offsetDirection =
        thumbsSlideAxis === 'x' ? 'offsetLeft' : 'offsetTop'
      const offsetDimension =
        thumbsSlideAxis === 'x' ? 'offsetWidth' : 'offsetHeight'
      const dimensionProperty = thumbsSlideAxis === 'x' ? 'width' : 'height'
      const scrollDirection =
        thumbsSlideAxis === 'x' ? 'scrollLeft' : 'scrollTop'

      const thumbOffsetPosition =
        currentThumbItemNode[offsetDirection] +
        currentThumbItemNode[offsetDimension] / 2
      const thumbScrollDimension =
        internalThumbsWrapperRef.current!.getBoundingClientRect()[
          dimensionProperty
        ] / 2

      setThumbListStyles({
        from: {
          [thumbsSlideAxis]: internalThumbsWrapperRef.current![scrollDirection]
        },
        to: {
          [thumbsSlideAxis]: thumbOffsetPosition - thumbScrollDimension
        },
        onChange: (val: unknown) => {
          if (thumbsSlideAxis === 'x') {
            // @ts-ignore
            internalThumbsWrapperRef!.current!.scrollLeft = val.x
          } else {
            // @ts-ignore
            internalThumbsWrapperRef!.current!.scrollTop = val.y
          }
        }
      })
    }
  }

  const thumbsFragment = withThumbs ? (
    <div
      ref={internalThumbsWrapperRef}
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: thumbsSlideAxis === 'x' ? 'row' : 'column',
        ...(thumbsSlideAxis === 'x'
          ? { overflowX: 'auto' }
          : { overflowY: 'auto', maxHeight: '100%' })
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
    </div>
  ) : null

  return {
    thumbsFragment,
    handleThumbsScroll
  }
}
