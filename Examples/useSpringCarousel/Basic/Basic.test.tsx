import { render } from '@testing-library/react'
import { mockedItems } from '../mocked-data'
import { Basic } from './Basic'

describe('Basic example', () => {
  test('Snapshot', () => {
    const { container } = render(<Basic />)

    expect(container).toMatchSnapshot()
  })

  test('Render use-spring-carousel-wrapper', () => {
    const { getByTestId } = render(<Basic />)
    const carouselWrapper = getByTestId('use-spring-carousel-wrapper')

    expect(carouselWrapper).toBeInTheDocument()
  })

  test('Render use-spring-carousel-animated-wrapper', () => {
    const { getByTestId } = render(<Basic />)
    const carouselAnimatedWrapper = getByTestId(
      'use-spring-carousel-animated-wrapper',
    )

    expect(carouselAnimatedWrapper).toBeInTheDocument()
  })

  test('Render carousel items', () => {
    const { getAllByTestId } = render(<Basic />)
    const items = getAllByTestId('use-spring-carousel-item-wrapper')

    expect(items).toHaveLength(mockedItems.length)
  })

  test('Carousel wrapper has correct default styles', () => {
    const { getByTestId } = render(<Basic />)
    const carouselWrapper = getByTestId('use-spring-carousel-wrapper')

    expect(carouselWrapper).toHaveStyle({
      display: 'flex',
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    })
  })

  test('Carousel animated wrapper has correct default styles', () => {
    const { getByTestId } = render(<Basic />)
    const carouselAnimatedWrapper = getByTestId(
      'use-spring-carousel-animated-wrapper',
    )

    expect(carouselAnimatedWrapper).toHaveStyle({
      display: 'flex',
      flexDirection: 'row',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      position: 'relative',
    })
  })

  test('Carousel item has correct default styles', () => {
    const { getAllByTestId } = render(<Basic />)
    const items = getAllByTestId('use-spring-carousel-item-wrapper')

    items.forEach(i => {
      expect(i).toHaveStyle({
        display: 'flex',
        flex: `1 0 calc(100% / 1)`,
        position: 'relative',
      })
    })
  })
})
