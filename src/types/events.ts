export enum ReactSpringCustomEvents {
  'RCSJS:onSlideStartChange' = 'RCSJS:onSlideStartChange',
  'RCSJS:onSlideChange' = 'RCSJS:onSlideChange'
}

export type RCSJSOnSlideStartChange = {
  prevItem: number
  currentItem: number
  nextItem: number
}
export type RCSJSOnSlideChange = {
  prevItem: number
  currentItem: number
  nextItem: number
}
