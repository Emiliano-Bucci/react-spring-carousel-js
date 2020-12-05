import React from 'react'

interface Item {
  id: string
  renderItem: React.ReactNode
}

interface Props<T extends Item> {
  items: T[]
}

export function ReactSpringCarousel<T extends Item>({ items }: Props<T>) {
  console.log(items)
  return <div>asdasda</div>
}
