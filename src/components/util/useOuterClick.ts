'use client'

import { useEffect, useRef } from 'react'

export const useOuterClick = (callback: () => void) => {
  const callbackRef = useRef<() => void>(callback)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)

    function handleClick(e: MouseEvent) {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target as Node)
      ) {
        callbackRef.current()
      }
    }
  }, [])

  return innerRef
}