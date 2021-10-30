import { useSpringCarousel } from '../../../src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'

export function Basic() {
  const { carouselFragment, slideToNextItem, slideToPrevItem } = useSpringCarousel({
    // startEndGutter: 20,
    withLoop: false,
    itemsPerSlide: 'fluid',
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: (
        <SliderItem
          {...rest}
          css={css`
            ${rest.css};
            width: 400px;
          `}
        >
          {label}
        </SliderItem>
      ),
    })),
  })

  return (
    <div
      css={css`
        display: flex;
        overflow: hidden;
      `}
    >
      <button onClick={slideToPrevItem}>prev</button>
      <SliderWrapper>{carouselFragment}</SliderWrapper>
      <button onClick={slideToNextItem}>next</button>
    </div>
  )
}
