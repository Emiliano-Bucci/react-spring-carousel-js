import { mockedItems } from '../../useSpringCarousel/mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'
import { useTransitionCarousel } from '../../../src'
import { css } from '@emotion/react'

export function Basic() {
  const {
    carouselFragment,
    slideToNextItem,
    slideToPrevItem,
  } = useTransitionCarousel({
    withLoop: true,
    toPrevItemSpringProps: {
      initial: {
        opacity: 1,
        transform: 'translateX(0%)',
        position: 'absolute',
      },
      from: {
        transform: 'translateX(-100%)',
        opacity: 0,
        position: 'absolute',
      },
      enter: {
        transform: 'translateX(0%)',
        opacity: 1,
        position: 'relative',
      },
      leave: {
        transform: 'translateX(100%)',
        opacity: 0,
        position: 'absolute',
      },
    },
    toNextItemSpringProps: {
      initial: {
        opacity: 1,
        transform: 'translateX(0%)',
        position: 'absolute',
      },
      from: {
        transform: 'translateX(100%)',
        opacity: 0,
        position: 'absolute',
      },
      enter: {
        transform: 'translateX(0%)',
        opacity: 1,
        position: 'relative',
      },
      leave: {
        transform: 'translateX(-100%)',
        opacity: 0,
        position: 'absolute',
      },
    },
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
    })),
  })

  return (
    <div
      css={css`
        display: flex;
        width: 100%;
      `}
    >
      <button onClick={slideToPrevItem}>PREV</button>
      <SliderWrapper>{carouselFragment}</SliderWrapper>
      <button onClick={slideToNextItem}>NEXT</button>
    </div>
  )
}
