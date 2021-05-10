import { useRef } from 'react'
import { useSpring, SpringConfig, animated } from 'react-spring'
import {
  UseSpringCarouselProps,
  ReactSpringCarouselItem,
  ReactSpringThumbItem,
  PrepareThumbsData,
} from '../types'
import { useMount } from '../utils'

type OffsetDimension = 'offsetWidth' | 'offsetHeight'
type OffsetDirection = 'offsetLeft' | 'offsetTop'
type ScrollDirection = 'scrollLeft' | 'scrollTop'

type Props = {
  items: ReactSpringCarouselItem[]
  withThumbs: boolean
  thumbsSlideAxis: UseSpringCarouselProps['thumbsSlideAxis']
  thumbsWrapperRef?: UseSpringCarouselProps['thumbsWrapperRef']
  springConfig: SpringConfig
  prepareThumbsData?: PrepareThumbsData
}

export function useThumbsModule({
  items,
  withThumbs,
  thumbsSlideAxis = 'x',
  springConfig,
  thumbsWrapperRef,
  prepareThumbsData,
}: Props) {
  const internalThumbsWrapperRef = useRef<HTMLDivElement | null>(null)
  const [thumbListStyles, setThumbListStyles] = useSpring(() => ({
    [thumbsSlideAxis]: 0,
    config: springConfig,
  }))

  useMount(() => {
    if (withThumbs) {
      const missingThumbs = items.some(item => !item.renderThumb)

      if (missingThumbs) {
        throw new Error(
          'The renderThumb property is missing in one or more items. You need to add the renderThumb property to every item of the carousel when the prop withThumbs={true} or eventually set withThumbs={false}.',
        )
      }
    }
  })

  function handleThumbsScroll(activeItem: number) {
    function getOffsetDirection() {
      return thumbsSlideAxis === 'x' ? 'offsetLeft' : 'offsetTop'
    }
    function getOffsetDimension() {
      return thumbsSlideAxis === 'x' ? 'offsetWidth' : 'offsetHeight'
    }

    function getScrollDirecton() {
      return thumbsSlideAxis === 'x' ? 'scrollLeft' : 'scrollTop'
    }
    function getThumbNode() {
      return internalThumbsWrapperRef.current!.querySelector(
        `#thumb-${items[activeItem].id}`,
      ) as HTMLElement
    }
    function getThumbOffsetPosition({
      thumbNode,
      offsetDirection,
      offsetDimension,
    }: {
      thumbNode: HTMLElement
      offsetDirection: OffsetDirection
      offsetDimension: OffsetDimension
    }) {
      return (
        thumbNode[offsetDirection] + thumbNode[offsetDimension] / 2
      )
    }
    function getThumbScrollDimension({
      thumbWrapper,
      offsetDimension,
    }: {
      thumbWrapper: HTMLDivElement
      offsetDimension: OffsetDimension
    }) {
      return thumbWrapper[offsetDimension] / 2
    }
    function getScrollFromValue({
      thumbWrapper,
      scrollDirection,
    }: {
      thumbWrapper: HTMLDivElement
      scrollDirection: ScrollDirection
    }) {
      return thumbWrapper[scrollDirection]
    }
    function getScrollToValue({
      thumbWrapper,
      thumbOffsetPosition,
      thumbScrollDimension,
      offsetDimension,
    }: {
      thumbWrapper: HTMLDivElement
      thumbOffsetPosition: number
      thumbScrollDimension: number
      offsetDimension: OffsetDimension
    }) {
      const scrollDimensionProperty =
        thumbsSlideAxis === 'x' ? 'scrollWidth' : 'scrollHeight'

      if (
        activeItem === items.length - 1 ||
        thumbOffsetPosition - thumbScrollDimension >
          thumbWrapper[scrollDimensionProperty] -
            thumbWrapper[offsetDimension]
      ) {
        return (
          thumbWrapper[scrollDimensionProperty] -
          thumbWrapper[offsetDimension]
        )
      }

      if (activeItem === 0) {
        return 0
      }

      return thumbOffsetPosition - thumbScrollDimension
    }

    if (thumbsWrapperRef && thumbsWrapperRef.current) {
      internalThumbsWrapperRef.current = thumbsWrapperRef.current
    }

    const thumbNode = getThumbNode()

    if (thumbNode) {
      const thumbWrapper = internalThumbsWrapperRef.current!
      const offsetDirection = getOffsetDirection()
      const offsetDimension = getOffsetDimension()
      const scrollDirection = getScrollDirecton()
      const thumbOffsetPosition = getThumbOffsetPosition({
        thumbNode,
        offsetDimension,
        offsetDirection,
      })
      const thumbScrollDimension = getThumbScrollDimension({
        thumbWrapper,
        offsetDimension,
      })

      setThumbListStyles.start({
        from: {
          [thumbsSlideAxis]: getScrollFromValue({
            thumbWrapper,
            scrollDirection,
          }),
        },
        to: {
          [thumbsSlideAxis]: getScrollToValue({
            thumbWrapper,
            thumbOffsetPosition,
            thumbScrollDimension,
            offsetDimension,
          }),
        },
        onChange: val => {
          if (thumbsSlideAxis === 'x') {
            // @ts-ignore
            internalThumbsWrapperRef!.current!.scrollLeft = val.x
          } else {
            // @ts-ignore
            internalThumbsWrapperRef!.current!.scrollTop = val.y
          }
        },
      })
    }
  }

  function handlePrepareThumbsDate() {
    function getPreparedItems(
      _items: ReactSpringCarouselItem[],
    ): ReactSpringThumbItem[] {
      return _items.map(i => ({
        id: i.id,
        renderThumb: i.renderThumb,
      }))
    }

    if (prepareThumbsData) {
      return prepareThumbsData(getPreparedItems(items))
    }

    return getPreparedItems(items)
  }

  function getScrollDirectionSpringValue() {
    if (thumbsSlideAxis === 'x') {
      return {
        // @ts-ignore
        scrollLeft: thumbListStyles.x,
      }
    }

    return {
      // @ts-ignore
      scrollTop: thumbListStyles.y,
    }
  }

  const thumbsFragment = withThumbs ? (
    <animated.div
      ref={internalThumbsWrapperRef}
      {...getScrollDirectionSpringValue()}
      style={{
        display: 'flex',
        flex: 1,
        position: 'relative',
        flexDirection: thumbsSlideAxis === 'x' ? 'row' : 'column',
        ...(thumbsSlideAxis === 'x'
          ? { overflowX: 'auto' }
          : {
              overflowY: 'auto',
              maxHeight: '100%',
            }),
      }}
    >
      {handlePrepareThumbsDate().map(({ id, renderThumb }) => {
        const thumbId = `thumb-${id}`

        return (
          <div key={thumbId} id={thumbId}>
            {renderThumb}
          </div>
        )
      })}
    </animated.div>
  ) : null

  return {
    thumbsFragment,
    handleThumbsScroll,
  }
}
