import React, { HTMLAttributes } from 'react'
import { useSpringCarousel } from 'react-spring-carousel-js'

const Item = ({
  children,
  ...rest
}: { children: React.ReactNode } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      style={{
        flex: 1,
        padding: '8x 24px',
        cursor: 'grab',
        userSelect: 'none',
        ...rest?.style
      }}
    >
      {children}
    </div>
  )
}

const App = () => {
  const {
    carouselFragment,
    slideToPrevItem,
    slideToNextItem,
    slideToItem,
    useListenToCustomEvent,
    enterFullscreen
  } = useSpringCarousel({
    withLoop: true,
    // toPrevItemSpringProps: {
    //   initial: {
    //     opacity: 1
    //   },
    //   from: {
    //     transform: 'translateX(-100%)',
    //     opacity: 0,
    //     position: 'absolute'
    //   },
    //   enter: {
    //     transform: 'translateX(0%)',
    //     opacity: 1,
    //     position: 'relative'
    //   },
    //   leave: {
    //     transform: 'translateX(100%)',
    //     opacity: 0,
    //     position: 'absolute'
    //   }
    // },
    // toNextItemSpringProps: {
    //   initial: {
    //     opacity: 1
    //   },
    //   from: {
    //     transform: 'translateX(100%)',
    //     opacity: 0,
    //     position: 'absolute'
    //   },
    //   enter: {
    //     transform: 'translateX(0%)',
    //     opacity: 1,
    //     position: 'relative'
    //   },
    //   leave: {
    //     transform: 'translateX(-100%)',
    //     opacity: 0,
    //     position: 'absolute'
    //   }
    // },
    items: [
      {
        id: 'item-1',
        renderItem: (
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 1
          </Item>
        )
        // renderThumb: (
        //   <div
        //     onClick={() => slideToItem('item-2')}
        //     style={{
        //       height: 100,
        //       padding: '8px 16px',
        //       background: 'blue',
        //       width: 160
        //     }}
        //   >
        //     THUMB 1
        //   </div>
        // )
      },
      {
        id: 'item-2',
        renderItem: (
          <Item
            style={{
              background: 'yellow'
            }}
          >
            Item 2
          </Item>
        ),
        renderThumb: (
          <div
            style={{
              height: 100,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 2
          </div>
        )
      },
      {
        id: 'item-3',
        renderItem: (
          <Item
            style={{
              background: 'green'
            }}
          >
            Item 3
          </Item>
        ),
        renderThumb: (
          <div
            style={{
              height: 100,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 3
          </div>
        )
      },
      {
        id: 'item-1a',
        renderItem: (
          <Item
            style={{
              background: 'red'
            }}
          >
            Item 4
          </Item>
        ),
        renderThumb: (
          <div
            onClick={() => slideToItem('item-2')}
            style={{
              height: 100,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 4
          </div>
        )
      },
      {
        id: 'item-2a',
        renderItem: (
          <Item
            style={{
              background: 'black'
            }}
          >
            Item 5
          </Item>
        ),
        renderThumb: (
          <div
            style={{
              height: 100,
              padding: '8px 16px',
              background: 'blue',
              width: 160
            }}
          >
            THUMB 5
          </div>
        )
      }
    ],
    prepareThumbsData: (items) => {
      return [
        ...items,
        {
          id: 'aaa',
          renderThumb: <div>asda</div>
        }
      ]
    }
  })

  useListenToCustomEvent('onFullscreenChange', (data) => {
    console.log('onFullscreenChange', data)
  })

  return (
    <div
      style={{
        display: 'flex',
        padding: 24,
        background: 'orange',
        touchAction: 'none'
      }}
    >
      <button onClick={slideToPrevItem}>PREV</button>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 500,
          overflow: 'hidden'
        }}
      >
        <div style={{ flex: 1 }}>{carouselFragment}</div>
      </div>
      <button onClick={slideToNextItem}>NEXT</button>
      <button onClick={() => enterFullscreen()}>fullscreen</button>
    </div>
  )
}

export default App
