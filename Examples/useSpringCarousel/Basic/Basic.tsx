import { useSpringCarousel } from '../../../src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'

export function Basic() {
  const {
    carouselFragment,
    slideToNextItem,
    slideToPrevItem,
  } = useSpringCarousel({
    withLoop: true,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
    })),
  })
  return (
    <SliderWrapper>
      <div
        css={css`
          display: flex;
          height: 100%;
        `}
      >
        <button onClick={slideToPrevItem}>PREV</button>
        {carouselFragment}
        <button onClick={slideToNextItem}>NEXT</button>
      </div>
    </SliderWrapper>
  )
}
