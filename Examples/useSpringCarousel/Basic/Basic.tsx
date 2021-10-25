import { useSpringCarousel } from '../../../src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'

export function Basic() {
  const { carouselFragment } = useSpringCarousel({
    carouselSlideAxis: 'y',
    withLoop: true,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: (
        <SliderItem
          {...rest}
          css={css`
            ${rest.css};
            width: 320px;
          `}
        >
          {label}
        </SliderItem>
      ),
    })),
  })

  return <SliderWrapper>{carouselFragment}</SliderWrapper>
}
