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
