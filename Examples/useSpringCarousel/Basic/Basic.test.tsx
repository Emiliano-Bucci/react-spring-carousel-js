import { render } from '@testing-library/react'
import { Basic } from './Basic'

describe('Basic', () => {
  test('Snapshot', () => {
    const { container } = render(<Basic />)

    expect(container).toMatchSnapshot()
  })
})
