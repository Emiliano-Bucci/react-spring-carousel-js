# react-spring-carousel-js

> A performant React carousel component powered by `react-spring` and `react-use-gesture`.

[![NPM](https://img.shields.io/npm/v/react-spring-carousel-js.svg)](https://www.npmjs.com/package/react-spring-carousel-js)
[![NPM](https://img.shields.io/bundlephobia/minzip/react-spring-carousel-js)](https://img.shields.io/bundlephobia/minzip/react-spring-carousel-js)

## Features

- **Blazing fast**: `react-spring-carousel-js` uses `react-spring` under the hood, which means `smooth` and `natural` transitions like you've never seen before. :sunglasses:
- **Hedless Carousel**: a part from some needed div's (which you can override and customize), you're in total control on how the carousel will appear, bringing your own UI.
- **Highly customizable**: you can control what to render on every carousel item (and on every thumb item as well!).
- **Complete API availability**: either from the main **hook**, or either importing the own Carousel context, you can control the Carousel from every component if you need to.
- **Mobile first out of the box**: We use [**react-use-gesture**](https://www.npmjs.com/package/react-use-gesture) to implement the dragging functionality and there's no config required. It just works!
- **Fullscreen implementation out of the box**: If you need to, `react-carouse-spring-js` exposes a method to enter/exit from fullscreen mode (we use [**screenful.js**](https://github.com/sindresorhus/screenfull.js/) under the hood for a better cross browser compatibility).
- **Auto Resize out of the box**: The carousel will resize & adapt correctly when the browser resizes. This is particular useful when `entering`/`exiting` the fullscreen mode or when the mobile direction changes.

## Install

```bash
npm install --save react-spring-carousel-js
```

or

```bash
yarn add --save react-spring-carousel-js
```

# Usage

At it's most basic, to start you can do:

```tsx
import { useReactSpringCarousel } from 'react-spring-carousel-js'

const { carouselFragment, thumbsFragment } = useReactSpringCarousel({
  items: [
    {
      id: 'item-1',
      renderItem: <ItemComponent />,
      renderThumb: <ThumbComponent />
    },
    {
      id: 'item-2',
      renderItem: <ItemComponent />,
      renderThumb: <ThumbComponent />
    }
  ]
})

return (
  <div>
    {carouselFragment}
    {thumbsFragment}
  </div>
)
```

As you can see, you don't have to call the component in the traditional way but instead the main **hook** return the **carousel fragment** (which is the carousel) and the **thumbs fragment** (which render the list of tumbs). It's up to you to decide **how** and **where** render boths, and they're not tied in any way, so basically you can customize the UI pretty much in any way you want to!

## Props

You can provide this **options** to better customize the behavior and the aspect of the Carousel:

| Prop                       | Type                                                                                                   | Default Value    | Description                                                                                                                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| items                      | `T[]`                                                                                                  | `[]`             | You can extend the main interface - `ReactSpringCarouselItem` - by adding custom props to the item object if you need to.                                                                                                                                             |
| withLoop                   | `boolean`                                                                                              | `false`          | Set to `true` if you want to enable the infinite loop behavior                                                                                                                                                                                                        |
| withThumbs                 | `boolean`                                                                                              | `true`           | Set to false if you don't want to render the list of thumbs.                                                                                                                                                                                                          |
| springConfig               | `SpringConfig`                                                                                         | `config.default` | Here you can customize the properties of the `spring`.                                                                                                                                                                                                                |
| onItemStartToChange        | `VoidFunction`                                                                                         | `() => {}`       | A `callback` triggered every time a item is about to change (slide).                                                                                                                                                                                                  |
| onItemChange               | `VoidFunction`                                                                                         | `() => {}`       | A `callback` triggered every time a item finish sliding (the callback is called inside the `onRest` react-spring method).                                                                                                                                             |
| shouldResizeOnWindowResize | `boolean`                                                                                              | `true`           | Set to `false` if you don't want to resize the carousel when the browser resize. Remember that if you set `shouldResizeOnWindowResize` to false, when using the fullscreen mode the carousel will not adapt correctly after `entering`/`exiting` the fullscreen mode. |
| draggingSlideTreshold      | `number`                                                                                               | `50`             | Set the minimum treshold that is required to slide after the item is dragged and then released.                                                                                                                                                                       |
| enableThumbsWrapperScroll  | `boolean`                                                                                              | `true`           | Set to false if you don't want to auto-scroll the list of thumbs when an item is selected. By default every time an item is selected and become the active one `react-spring-carousel-js` will automatically scroll the thumb wrapper list and will center the item.  |
| CustomWrapper              | `React.ForwardRefExoticComponent<{ children: React.ReactNode } & React.RefAttributes<HTMLDivElement>>` | `undefined`      | If you want, you can provide a custom `element` that will be used as the main Wrapper element. Note that you can pass whatever element you want to, using whatever style pattern you want!                                                                            |
| CustomThumbsWrapper        | `React.FC<{ children: React.ReactNode }>`                                                              | `undefined`      | If you want, you can provide a custom `element` to customize the wrapper of the thumb list. Note that you can pass whatever element you want to, using whatever style pattern you want!                                                                               |

## Options (API)

The following options and API can be both extracted from the main `hook` or for the own carouse `Context` (that can be imported and used inside any component rendered inside the Carousel :smirk:)

| Option          | Type                                            | Default Value | Description                                                                                                                                                                                                                                                                                                                          |
| --------------- | ----------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| activeItem      | `number`                                        | `0`           | Indicates the index of the current active item.                                                                                                                                                                                                                                                                                      |
| isFullscreen    | `boolean`                                       | `false`       | Indicates if the carousel entered in fullscreen mode.                                                                                                                                                                                                                                                                                |
| getIsActiveItem | `(id: string): boolean`                         | `false`       | By providing the `id` of an item, you can check if that item the current active one.                                                                                                                                                                                                                                                 |
| getIsPrevItem   | `(id: string): boolean`                         | `false`       | By providing the `id` of an item, you can check if that item is the previous one in the list of items. Pretty useful if, for example, you render a list of items and want to preload on demand.                                                                                                                                      |
| getIsNextItem   | `(id: string): boolean`                         | `false`       | By providing the `id` of an item, you can check if that item is the next one in the list of items. Pretty useful if, for example, you render a list of items and want to preload on demand.                                                                                                                                          |
| slideToItem     | `(item: number, callback?: VoidFunction): void` | `() => {}`    | You can use this method to programmatically slide to a specific item. You can also pass a callback if you want to perform some action after the animation is completed. **NOTE**: The callback is passed and called by the `onRest()` method of `react-spring`.                                                                      |
| getIsAnimating  | `(): boolean`                                   | `() => false` | Use this method to check if the carousel is `animating` or not. Under the hood, `react-carousel-spring-js` uses a ref to keep track of this value. We don't use a state to avoid useless re-render that could impact in the animation smoothness.                                                                                    |
| getIsDragging   | `(): boolean`                                   | `() => false` | Use this method to check if the carousel is `dragging` or not. Under the hood, `react-carousel-spring-js` uses a ref to keep track of this value. We don't use a state to avoid useless re-render that could impact in the animation smoothness.                                                                                     |
| enterFullscreen | `(elementRef?: HTMLElement): void`              | `() => {}`    | Use this method to enter in the `fullscreen` mode. **NOTE**: By default, the main wrapper of the carousel will enter in fullscreen mode, but normally you will want to put in the fullscreen mode also other elements, that's why you can pass a custom element ref.                                                                 |
| slideToPrevItem | `(): void`                                      | `() => {}`    | Use this method slide to the `previous` item. This is useful to build your own navigation buttons. You just need to call it and that's it; the carousel itself will handle all the internal logic part (for example, if the `withLoop` property is set to `false`, when reaching the first item, if you call it it will do nothing.) |
| slideToNextItem | `(): void`                                      | `() => {}`    | Use this method slide to the `next` item. This is useful to build your own navigation buttons. You just need to call it and that's it; the carousel itself will handle all the internal logic part (for example, if the `withLoop` property is set to `false`, when reaching the last item, if you call it it will do nothing.)      |

## License

MIT © [Emiliano-Bucci](https://github.com/Emiliano-Bucci)
