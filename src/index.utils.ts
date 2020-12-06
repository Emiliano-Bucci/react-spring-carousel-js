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
