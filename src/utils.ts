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
  console.log({
    index,
    totalItems,
  })
  if (index === -1) {
    console.log('here 1')
    return totalItems - 1
  }

  if (index >= totalItems) {
    console.log('here 2')
    return 0
  }

  console.log('here 3')
  return index
}

export function getIsBrowser() {
  return typeof window !== 'undefined'
}
