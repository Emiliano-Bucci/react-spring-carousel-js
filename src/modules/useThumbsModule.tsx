import { forwardRef, HTMLAttributes, useRef } from 'react'
import { useSpring, SpringConfig, animated } from 'react-spring'
import { useMount } from 'src/utils'
import {
  UseSpringCarouselProps,
  ReactSpringThumbItem,
  PrepareThumbsData,
  UseSpringCarouselItems,
  SlideActionType,
} from '../types'

type OffsetDimension = 'offsetWidth' | 'offsetHeight'
type OffsetDirection = 'offsetLeft' | 'offsetTop'
type ScrollDirection = 'scrollLeft' | 'scrollTop'

type Props = {
  items: UseSpringCarouselItems['items']
  withThumbs: boolean
  thumbsSlideAxis: UseSpringCarouselProps['thumbsSlideAxis']
  springConfig: SpringConfig
  prepareThumbsData?: PrepareThumbsData
  itemsPerSlide?: UseSpringCarouselProps['itemsPerSlide']
  CustomThumbsWrapperComponent?: UseSpringCarouselProps['CustomThumbsWrapperComponent']
  getFluidWrapperScrollValue?(): number
  getSlideValue?(): number
}

type WrapperProps = {
  children: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

const InternalWrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ children, ...rest }, ref) => {
    return (
      <animated.div {...rest} ref={ref}>
        {children}
      </animated.div>
    )
  },
)

export function useThumbsModule({
  items,
  withThumbs,
  thumbsSlideAxis = 'x',
  springConfig,
  prepareThumbsData,
  itemsPerSlide,
  getFluidWrapperScrollValue = () => 0,
  getSlideValue = () => 0,
  CustomThumbsWrapperComponent,
}: Props) {
  const internalThumbsWrapperRef = useRef<HTMLDivElement | null>(null)
  const [thumbListStyles, setThumbListStyles] = useSpring(() => ({
    x: 0,
    y: 0,
    config: springConfig,
    onChange: ({ value }) => {
      if (internalThumbsWrapperRef.current) {
        internalThumbsWrapperRef.current[
          thumbsSlideAxis === 'x' ? 'scrollLeft' : 'scrollTop'
        ] = Math.abs(value[thumbsSlideAxis])
      }
    },
  }))

  useMount(() => {
    if (withThumbs && !internalThumbsWrapperRef.current) {
      throw new Error(
        "The thumbs wrapper is not defined. If you've passed a Functional component, be sure to wrap your component in forwardRef.",
      )
    }
  })

  function getCurrentThumbScrollValue() {
    return internalThumbsWrapperRef.current![
      thumbsSlideAxis === 'x' ? 'scrollLeft' : 'scrollTop'
    ]
  }
  function getThumbsTotalScrollableValue() {
    return Math.round(
      Number(
        internalThumbsWrapperRef.current?.[
          thumbsSlideAxis === 'x' ? 'scrollWidth' : 'scrollHeight'
        ],
      ) -
        internalThumbsWrapperRef.current!.getBoundingClientRect()[
          thumbsSlideAxis === 'x' ? 'width' : 'height'
        ],
    )
  }

  function getThumbSlideValue() {
    const thumbSlideTotal = Math.round(getFluidWrapperScrollValue() / getSlideValue())
    const totalScrollableValue = getThumbsTotalScrollableValue()
    return totalScrollableValue / thumbSlideTotal
  }

  function handleThumbsScroll(activeItem: number, actionType?: SlideActionType) {
    if (itemsPerSlide === 'fluid') {
      const totalScrollableValue = getThumbsTotalScrollableValue()

      if (actionType === 'next') {
        const nextValue = getCurrentThumbScrollValue() + getThumbSlideValue()
        setThumbListStyles.start({
          from: {
            [thumbsSlideAxis]: getCurrentThumbScrollValue(),
          },
          to: {
            [thumbsSlideAxis]:
              nextValue > totalScrollableValue ? totalScrollableValue : nextValue,
          },
        })
      }
      if (actionType === 'prev') {
        const nextValue = getCurrentThumbScrollValue() - getThumbSlideValue()
        setThumbListStyles.start({
          from: {
            [thumbsSlideAxis]: getCurrentThumbScrollValue(),
          },
          to: {
            [thumbsSlideAxis]: nextValue < 0 ? 0 : nextValue,
          },
        })
      }
    } else {
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
        return thumbNode[offsetDirection] + thumbNode[offsetDimension] / 2
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
            thumbWrapper[scrollDimensionProperty] - thumbWrapper[offsetDimension]
        ) {
          return thumbWrapper[scrollDimensionProperty] - thumbWrapper[offsetDimension]
        }
        if (activeItem === 0) {
          return 0
        }

        return thumbOffsetPosition - thumbScrollDimension
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
  }
  function handlePrepareThumbsDate() {
    function getPreparedItems(
      _items: UseSpringCarouselItems['items'],
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

  const Wrapper = CustomThumbsWrapperComponent
    ? animated(CustomThumbsWrapperComponent)
    : InternalWrapper

  const thumbsFragment = withThumbs ? (
    <Wrapper
      ref={internalThumbsWrapperRef}
      className="use-spring-carousel-thumbs-wrapper"
      onWheel={() => {
        thumbListStyles[thumbsSlideAxis].stop()
      }}
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
    </Wrapper>
  ) : null

  return {
    thumbsFragment,
    handleThumbsScroll,
  }
}
