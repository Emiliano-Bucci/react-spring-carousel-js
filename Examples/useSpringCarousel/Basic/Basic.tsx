import { useSpringCarousel } from '../../../src/carouselTypes'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'

export function Basic() {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem,
  } = useSpringCarousel({
    withLoop: true,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
    })),
  })
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
      }}
    >
      <button onClick={slideToPrevItem}>PREV</button>
      <SliderWrapper>{carouselFragment}</SliderWrapper>
      <button onClick={slideToNextItem}>NEXT</button>
    </div>
  )
}
