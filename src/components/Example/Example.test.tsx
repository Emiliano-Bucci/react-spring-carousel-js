import { Example } from './Example'
import { render } from '@testing-library/react'

describe('Test', () => {
  test('Snapshot', () => {
    const { container } = render(<Example />)

    expect(container).toMatchSnapshot()
  })
})
