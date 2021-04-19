# react-spring-carousel-js

> A performant React carousel component powered by `react-spring` and `react-use-gesture`.

[![NPM](https://img.shields.io/npm/v/react-spring-carousel-js.svg)](https://www.npmjs.com/package/react-spring-carousel-js) [![NPM](https://img.shields.io/bundlephobia/minzip/react-spring-carousel-js)](https://img.shields.io/bundlephobia/minzip/react-spring-carousel-js)

## Official documentation

[Visit here](https://react-spring-carousel-js.emilianobucci.com)

## Features

- **Extreemely performant**: thanks to react-spring, you'll get a excelent performance with smooth and natural transitions out of the box.
- **Custom events**: Use our custom events to intercept when things happen and take the experience to the next level!
- **Mobile first**: You can swipe/drag with no config needed thanks to **react-use-gesture**.
- **Resizable**: the carousel will automatically resize and adapt if the browser viewport change. Very useful when changing to landscape on mobile devices.
- **Fullscreen capable**: we provide you the **API** to enter/exit from fullscreen mode! (thanks to **screenful.js**).
- **Headles UI**: no more headaches trying to style the elements of the carousel. You decide every aspect of the elements of the carousel.
- **Totally composable**: we give you the instruments (**API**) and you decide where to place all the elements of the carousel and how they will behave and interact.
- **Easy to configure**: configure the carousel behavior is a piece of cake!

## Install

```bash
npm install --save react-spring-carousel-js
```

or

```bash
yarn add --save react-spring-carousel-js
```

## Usage

At it's most basic, to start using the carousel you can do:

```tsx
import { useSpringCarousel } from 'react-spring-carousel-js'

const { carouselFragment } = useSpringCarousel({
  items: [
    {
      id: 'item-1',
      renderItem: <ItemComponent />,
      renderThumb: <ThumbComponent />,
    },
    {
      id: 'item-2',
      renderItem: <ItemComponent />,
      renderThumb: <ThumbComponent />,
    },
  ],
})

return <div>{carouselFragment}</div>
```

As you can see, you don't have to call the component in the traditional way but instead the main **hook** return the **carousel fragment** (which is the carousel) and eventually the **thumbs fragment** (which will render the list of tumbs). It's up to you to decide **how** and **where** render boths, and they're not tied in any way, so basically you can customize the UI pretty much in any way you want to!

## Props

You can provide this **options** to better customize the behavior and the aspect of the Carousel:

| Prop                       | Type                                                                       | Default          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------- | -------------------------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| items                      | `{id: string renderItem: React.ReactNode renderThumb?: React.ReactNode}[]` | `[]`             | Object type of the single carousel slide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| withLoop                   | `boolean`                                                                  | `false`          | Set to `true` if you want to enable the infinite loop behavior.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| withThumbs                 | `boolean`                                                                  | `true`           | Set to false if you don't want to render the list of thumbs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| springConfig               | `SpringConfig`                                                             | `config.default` | Customize the spring animation props.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| shouldResizeOnWindowResize | `boolean`                                                                  | `true`           | Set to false if you want to disable the auto rezise                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| draggingSlideTreshold      | `number`                                                                   | `50`             | Set the minimum treshold that is required to slide after the item is dragged and then released.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| enableThumbsWrapperScroll  | `boolean`                                                                  | `true`           | Set to false if you don't want to auto-scroll the list of thumbs when an item is selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| carouselSlideAxis          | `x / y`                                                                    | `x`              | Specify the slide axis direction of the carousel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| thumbsSlideAxis            | `x / y`                                                                    | `x`              | Specify the slide axis direction of the thumbs list                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| thumbsMaxHeight            | `number`                                                                   | `0`              | Set the max height of the thumb list wrapper; to be only used if you set thumbsSlideAxis to `y`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| thumbsWrapperRef           | `React.MutableRefObject<HTMLDivElement / null>`                            | `undefined`      | Pass a wrapper ref if you want to style in a particular way the thumbs wrapper list and still want to have the automatic scroll out of the box. If you set `carouselSlideAxis='x'` probably you wouldn't want to do it, as we automatically handle this case. In case you set `carouselSlideAxis='y'` you have to options: or you set the `thumbsMaxHeight` to a fixed height, or if you need to have a fluid height - 100% - then in this case you should pass the ref of the wrapper. This way, we will use your ref to handle the scroll (remember to also set `overflow-y: auto`). |
| initialActiveItem          | `number`                                                                   | `0`              | Set the initial active slide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| itemsPerSlide              | `number`                                                                   | `1`              | Define the quantity of items to show per `slide`. It can't be greater than the maximum quantity of items provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| initialStartingPosition    | `start` / `center` / `end`                                                 | `start`          | `Note: only works if withLoop={true}` Defines the starting position of the current active slide. Normally if you have 3 active items per `slide`, you'll see 1,2,3. If you set `initialStartingPosition='center'`, for example, you'll get the following order: 3,1,2.                                                                                                                                                                                                                                                                                                                 |
| disableGestures            | `boolean`                                                                  | `false`          | Disable the drag gesture programmatically.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Options (API)

The following options and API can be both extracted from the main `hook` or from the own Carousel `Context` (that can be imported and used inside any component rendered inside the Carousel :smirk:)

| Option                 | Type                                                                            | Default Value                | Description                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| isFullscreen           | `boolean`                                                                       | `false`                      | Indicates if the carousel entered in fullscreen mode.                                                                                                                                                                                                                                                                                |
| getIsActiveItem        | `(id: string): boolean`                                                         | `false`                      | By providing the `id` of an item, you can check if that item the current active one.                                                                                                                                                                                                                                                 |
| getCurrentActiveItem   | `() => ({id: string, index: number})`                                           | `() => ({id: '', index: 0})` | To retrieve the `id` and `index` of the current active item.                                                                                                                                                                                                                                                                         |
| getIsPrevItem          | `(id: string): boolean`                                                         | `false`                      | By providing the `id` of an item, you can check if that item is the previous one in the list of items. Pretty useful if, for example, you render a list of items and want to preload on demand.                                                                                                                                      |
| getIsNextItem          | `(id: string): boolean`                                                         | `false`                      | By providing the `id` of an item, you can check if that item is the next one in the list of items. Pretty useful if, for example, you render a list of items and want to preload on demand.                                                                                                                                          |
| slideToItem            | `(item: string / number): void`                                                 | `() => {}`                   | You can use this method to programmatically slide to a specific item. You can pass the index of the item or the id.                                                                                                                                                                                                                  |
| getIsAnimating         | `(): boolean`                                                                   | `() => false`                | Use this method to check if the carousel is `animating` or not. Under the hood, `react-carousel-spring-js` uses a ref to keep track of this value. We don't use a state to avoid useless re-render that could impact in the animation smoothness.                                                                                    |
| getIsDragging          | `(): boolean`                                                                   | `() => false`                | Use this method to check if the carousel is `dragging` or not. Under the hood, `react-carousel-spring-js` uses a ref to keep track of this value. We don't use a state to avoid useless re-render that could impact in the animation smoothness.                                                                                     |
| enterFullscreen        | `(elementRef?: HTMLElement): void`                                              | `() => {}`                   | Use this method to enter in the `fullscreen` mode. **NOTE**: By default, the main wrapper of the carousel will enter in fullscreen mode, but normally you will want to put in the fullscreen mode also other elements, that's why you can pass a custom element ref.                                                                 |
| slideToPrevItem        | `(): void`                                                                      | `() => {}`                   | Use this method slide to the `previous` item. This is useful to build your own navigation buttons. You just need to call it and that's it; the carousel itself will handle all the internal logic part (for example, if the `withLoop` property is set to `false`, when reaching the first item, if you call it it will do nothing.) |
| slideToNextItem        | `(): void`                                                                      | `() => {}`                   | Use this method slide to the `next` item. This is useful to build your own navigation buttons. You just need to call it and that's it; the carousel itself will handle all the internal logic part (for example, if the `withLoop` property is set to `false`, when reaching the last item, if you call it it will do nothing.)      |
| useListenToCustomEvent | `<T>(eventName: ReactSpringCustomEvents, eventHandler: (data?: T): void): void` | `() => {}`                   | Use this hook to perform callback actions in your application when the carousel internal `state` change.                                                                                                                                                                                                                             |

## Events

Sometimes it can happend that we'll want to perform some actions when a user interact with the carousel (for example, maybe you'll want to do something every time a slide changes). Normally you'll use **callbacks** to perform actions but this pattern wasn't enough from our perspective.

The first reason was because we wanted to avoid, as much as possible, to leverage on the **state** update (AKA React rerender) to perform animations, so that wasn't an option. The second point was that if we wanted to use callbacks it would require us to pass them down from the highest level (you would need to pass them directly into the main hook), and this solution didn't give us the flexibility we wanted. For this reason it was decided to implement our custom events, so that you'll be able to listen pretty much from everywhere and respond accordingly in a simple and effective way.

### How they works?

Every instance of the Carousel will expose a `useListenToCustomEvent` hook. `useListenToCustomEvent` accept two arguments:

- The event name to listen.
- A callback that will receive some data (dependind on the event that we listen) that will be triggered every time the event is emitted.

### List of events

| Event              | Description                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| onSlideStartChange | The event is emitted every time a slide is about to slide.                                                 |
| onSlideChange      | The event is emitted after the animation slide is completed.                                               |
| onDrag             | The event is emitted when a user drags the carousel items (only available when using `useSpringCarousel`). |
| onFullscreenChange | The event is emitted when a user enter/exit from the fullscreen mode.                                      |
| onLeftSwipe        | The event is emitted when a user swipe to the left (only available when using `useTransitionCarousel`).    |
| onRightSwipe       | The event is emitted when a user swipe to the right (only available when using `useTransitionCarousel`).   |

To proper type the props that the event will receive, you can use the following types:

- onSlideStartChange -> `OnSlideStartChange`
- onSlideChange -> `OnSlideChange`
- onDrag -> `OnDrag`
- onFullscreenChange -> `OnFullscreenChange`

## License

MIT © [Emiliano-Bucci](https://github.com/Emiliano-Bucci)
