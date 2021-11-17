import { useSpringCarousel } from 'src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from 'examples/components/SliderItem/SliderItem'
import { SliderWrapper } from 'examples/components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'

export function Development() {
  const { carouselFragment, slideToNextItem, slideToPrevItem, thumbsFragment } =
    useSpringCarousel<'fluid'>({
      itemsPerSlide: 'fluid',
      slideAmount: 386,
      freeScroll: true,
      withThumbs: true,
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
        renderThumb: (
          <div
            css={css`
              padding: 24px;
              min-width: 200px;
              ${rest.css}
            `}
          >
            {label}
          </div>
        ),
      })),
    })

  return (
    <div
      css={css`
        display: grid;
      `}
    >
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
      <div
        css={css`
          overflow: hidden;
        `}
      >
        {thumbsFragment}
      </div>
    </div>
  )
}
