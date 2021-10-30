import { css, Global } from '@emotion/react'

export const SliderWrapper: React.FC = ({ children }) => {
  return (
    <div
      css={css`
        border-radius: 12px;
        overflow: hidden;
        background-color: #fff;
        border: 36px solid black;
        flex: 1;
        margin: 24px;
        box-shadow: 0 6.7px 5.3px rgba(0, 0, 0, 0.0012),
          0 12.3px 17.9px rgba(0, 0, 0, 0.062), 0 10px 20px rgba(0, 0, 0, 0.06);
      `}
    >
      <Global
        styles={css`
          html {
            display: flex;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

          body {
            display: flex;
            flex: 1;
            letter-spacing: 1px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
              Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          #root {
            display: flex;
            flex: 1;
            width: 100vw;
          }

          .sb-main-padded.sb-main-padded {
            display: flex;
            padding: 0;
            margin: 0;
          }
        `}
      />
      {children}
    </div>
  )
}
