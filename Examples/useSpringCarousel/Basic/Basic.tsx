import { useSpringCarousel } from '../../../src/carouselTypes'
import { mockedItems } from '../mocked-data'

export function Basic() {
  const { carouselFragment } = useSpringCarousel({
    items: mockedItems.map(i => ({
      id: i.id,
      renderItem: <div>{i.label}</div>,
    })),
  })
  return <div>{carouselFragment}</div>
}
