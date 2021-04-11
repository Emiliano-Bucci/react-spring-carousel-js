import { css } from '@emotion/react'

export const SliderItem: React.FC = ({ children }) => {
  return (
    <div
      css={css`
        border-radius: 8px;
        background: red;
      `}
    >
      {children}
    </div>
  )
}
