import { useSpringCarousel } from 'src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from 'examples/components/SliderItem/SliderItem'
import { SliderWrapper } from 'examples/components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'

export function Development() {
  const { carouselFragment, slideToNextItem, slideToPrevItem } =
    useSpringCarousel<'fluid'>({
      itemsPerSlide: 'fluid',
      slideAmount: 550,
      items: mockedItems.map(({ id, label, ...rest }) => ({
        id,
        renderItem: (
          <SliderItem
            {...rest}
            css={css`
              ${rest.css};
              width: 300px;
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
