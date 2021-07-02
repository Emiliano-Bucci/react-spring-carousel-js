import { useSpringCarousel } from '../../../src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from '../../components/SliderItem/SliderItem'
import { SliderWrapper } from '../../components/SliderWrapper/SliderWrapper'
import { useEffect, useState } from 'react'

export function Basic() {
  const [val, setVal] = useState(80)
  const { carouselFragment } = useSpringCarousel({
    itemsPerSlide: 1,
    withLoop: true,
    gutter: val === 80 ? 24 : 16,
    percentage: val,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
    })),
  })

  useEffect(() => {
    const tablet = window.matchMedia('(max-width: 400px)')
    tablet.addEventListener('change', e => {
      if (e.matches) {
        setVal(40)
      } else {
        setVal(80)
      }
    })
  }, [])

  return <SliderWrapper>{carouselFragment}</SliderWrapper>
}
