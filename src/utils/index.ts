import { useRef, useEffect } from 'react'

type Callback = () => void | (() => void)

export function useMount(callback: Callback) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      const clean = callback()
      isMounted.current = true

      return () => {
        clean && clean()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function fixNegativeIndex(index: number, totalItems: number) {
  if (index === -1) {
    return totalItems - 1
  }

  if (index >= totalItems) {
    return 0
  }

  return index
}
