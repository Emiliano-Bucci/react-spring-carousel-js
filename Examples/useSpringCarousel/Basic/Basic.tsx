import { useSpringCarousel } from '../../../src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'

export function Basic() {
  const {
    carouselFragment,
    thumbsFragment,
    slideToNextItem,
    slideToPrevItem,
  } = useSpringCarousel({
    withLoop: true,
    withThumbs: true,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
      renderThumb: (
        <div
          css={css`
            width: 400px;
            height: 200px;
            ${rest.css}
          `}
        >
          THUMB {id}
        </div>
      ),
    })),
  })
  return (
    <SliderWrapper>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          height: 100%;
        `}
      >
        <div
          css={css`
            flex: 1;
            display: flex;
          `}
        >
          <button onClick={slideToPrevItem}>PREV</button>
          {carouselFragment}
          <button onClick={slideToNextItem}>NEXT</button>
        </div>
        <div
          css={css`
            flex: 1;
            overflow: hidden;
          `}
        >
          {thumbsFragment}
        </div>
      </div>
    </SliderWrapper>
  )
}
