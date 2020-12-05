import styled from '@emotion/styled'
import { animated } from 'react-spring'

export const Wrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: orange;
  overflow: hidden;
`

export const CarouselWrapper = styled(animated.div)`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: green;
`

export const CarouselItemWrapper = styled.div`
  flex: 1 0 100%;
  background-color: red;
`
