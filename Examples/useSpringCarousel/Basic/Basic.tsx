import { useSpringCarousel } from '../../../src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'

export function Basic() {
  const { carouselFragment } = useSpringCarousel({
    gutter: 24,
    withLoop: true,
    itemsPerSlide: 6,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
    })),
  })
  return <SliderWrapper>{carouselFragment}</SliderWrapper>
}
