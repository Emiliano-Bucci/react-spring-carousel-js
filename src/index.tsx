import React from 'react'
import { Wrapper } from './index.styles'

interface Item {
  id: string
  renderItem: React.ReactNode
}

interface Props<T extends Item> {
  items: T[]
}

export function ReactSpringCarousel<T extends Item>({ items }: Props<T>) {
  console.log(items)
  return <Wrapper>asdasda</Wrapper>
}
