import { css } from '@emotion/react'

export const SliderItem: React.FC = ({ children, ...rest }) => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 24px;
        color: #fff;
        min-height: 200px;
      `}
      {...rest}
    >
      {children}
    </div>
  )
}
