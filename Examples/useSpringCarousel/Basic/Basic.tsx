import { useSpringCarousel } from '../../../src/carouselTypes'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'

export function Basic() {
  const { carouselFragment } = useSpringCarousel({
    items: mockedItems.map(i => ({
      id: i.id,
      renderItem: <SliderItem>{i.label}</SliderItem>,
    })),
  })
  return <div>{carouselFragment}</div>
}
