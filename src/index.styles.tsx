import React, { forwardRef } from 'react'

export const InternalCarouselWrapper = forwardRef(
  (
    { children }: { children: React.ReactNode },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    )
  }
)

export function InternalThumbsWrapper({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex'
      }}
    >
      {children}
    </div>
  )
}
