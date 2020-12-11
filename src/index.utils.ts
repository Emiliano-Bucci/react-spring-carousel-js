import { useRef, useEffect } from 'react'

export function useMount(callback: () => void) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      callback()
      isMounted.current = true
    }
  }, [callback])
}

export function prepareDataForCustomEvent<T>(data: T) {
  return {
    detail: {
      ...data
    }
  }
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
