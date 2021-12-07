import { useSpringCarousel } from 'src'
import { mockedItems } from '../mocked-data'
import { SliderItem } from 'examples/components/SliderItem/SliderItem'
import { SliderWrapper } from 'examples/components/SliderWrapper/SliderWrapper'
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

export function Development() {
  const [itemsPerSlide, setItemPerSlide] = useState(3)
  const { carouselFragment, slideToNextItem, slideToPrevItem } = useSpringCarousel({
    itemsPerSlide: 3,
    withLoop: true,
    items: mockedItems.map(({ id, label, ...rest }) => ({
      id,
      renderItem: <SliderItem {...rest}>{label}</SliderItem>,
    })),
  })

  useEffect(() => {
    const tablet = window.matchMedia('(max-width: 800px)')
    if (tablet.matches) {
      setItemPerSlide(1)
    } else {
      setItemPerSlide(3)
    }

    tablet.addListener(e => {
      if (e.matches) {
        setItemPerSlide(1)
      } else {
        setItemPerSlide(3)
      }
    })
  }, [])

  return (
    <div
      css={css`
        display: grid;
        width: 100%;
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
    </div>
  )
}
