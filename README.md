# react-spring-carousel-js

> A performant React carousel component powered by react-spring.

[![NPM](https://img.shields.io/npm/v/react-spring-carousel-js.svg)](https://www.npmjs.com/package/react-spring-carousel-js)
[![NPM](https://img.shields.io/bundlephobia/minzip/react-spring-carousel-js)](https://img.shields.io/bundlephobia/minzip/react-spring-carousel-js)

# Features

- **Hedless Carousel**: a part from some needed div's (which you can override and customize), you're in total control on how the carousel will appear, bringing your own UI.
- **Highly customizable**: you can control what to render on every carousel item (and on every thumb item as well!).
- **Complete API availability**: either from the main **hook**, or either importing the own Carousel context, you can control the Carousel from every component if you need to.
- **Fullscreen implementation out of the box**: If you need to, `react-carouse-spring-js` exposes a method to enter/exit from fullscreen mode (for a better cross browser compatibility, under the hood we use [**screenful.js**](https://github.com/sindresorhus/screenfull.js/)).

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

## License

MIT © [Emiliano-Bucci](https://github.com/Emiliano-Bucci)
