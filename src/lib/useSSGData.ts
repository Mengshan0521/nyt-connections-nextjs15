'use client'

import { useState, useEffect, useMemo } from 'react'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const ERROR_RETRY_DELAY = 1000 // 1 second

interface CacheEntry<T> {
  data: T
  timestamp: number
  error?: Error
}

interface UseSSGDataOptions<T> {
  key: string
  fetcher: () => Promise<T>
  cacheDuration?: number
  retryCount?: number
  staleWhileRevalidate?: boolean
}

// Global cache store
const globalCache = new Map<string, CacheEntry<any>>()

function getCache<T>(key: string): CacheEntry<T> | null {
  const entry = globalCache.get(key)
  if (!entry) return null
  
  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION
  if (isExpired) {
    globalCache.delete(key)
    return null
  }
  
  return entry
}

function setCache<T>(key: string, data: T, error?: Error): void {
  globalCache.set(key, {
    data,
    timestamp: Date.now(),
    error
  })
}

export function useSSGData<T>({
  key,
  fetcher,
  cacheDuration = CACHE_DURATION,
  retryCount = 3,
  staleWhileRevalidate = true
}: UseSSGDataOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)

  // Check cache first
  const cachedData = useMemo(() => getCache<T>(key), [key])

  const fetchData = async (isRetry = false) => {
    try {
      setLoading(true)
      
      // If we have cached data and want to use it while revalidating
      if (cachedData && staleWhileRevalidate && !isRetry) {
        setData(cachedData.data)
      }
      
      const result = await fetcher()
      setData(result)
      setCache(key, result)
      setError(null)
      setRetryAttempt(0)
    } catch (err) {
      const error = err as Error
      setError(error)
      setCache(key, null, error)
      
      // Retry logic
      if (retryAttempt < retryCount) {
        setTimeout(() => {
          setRetryAttempt(prev => prev + 1)
          fetchData(true)
        }, ERROR_RETRY_DELAY * (retryAttempt + 1))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!cachedData) {
      fetchData()
    } else if (staleWhileRevalidate) {
      // Revalidate in the background
      fetchData()
    }
  }, [key, retryAttempt])

  // Revalidate on focus
  useEffect(() => {
    const handleFocus = () => {
      if (cachedData) {
        fetchData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [key, cachedData])

  // Invalidate cache when component unmounts
  useEffect(() => {
    return () => {
      // Optional: clear cache on unmount
      // globalCache.delete(key)
    }
  }, [key])

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(),
    cachedData: cachedData?.data || null
  }
}

// Server-side cache helper
export async function getServerCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheDuration: number = CACHE_DURATION
): Promise<{ data: T | null; fromCache: boolean }> {
  const cached = getCache<T>(key)
  
  if (cached) {
    return { data: cached.data, fromCache: true }
  }
  
  try {
    const data = await fetcher()
    setCache(key, data)
    return { data, fromCache: false }
  } catch (error) {
    setCache(key, null, error as Error)
    return { data: null, fromCache: false }
  }
}