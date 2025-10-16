'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface PerformanceOptimizerProps {
  children: React.ReactNode
  enablePrefetch?: boolean
  enableLazyLoading?: boolean
  enableBundleAnalysis?: boolean
}

export function PerformanceOptimizer({
  children,
  enablePrefetch = true,
  enableLazyLoading = true,
  enableBundleAnalysis = true
}: PerformanceOptimizerProps) {
  const [isOptimized, setIsOptimized] = useState(false)

  useEffect(() => {
    // Performance optimization setup
    if (typeof window !== 'undefined') {
      // Enable preconnect
      if (enablePrefetch) {
        const preconnectDomains = [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com'
        ]

        preconnectDomains.forEach(domain => {
          const link = document.createElement('link')
          link.rel = 'preconnect'
          link.href = domain
          link.crossOrigin = 'anonymous'
          document.head.appendChild(link)
        })
      }

      // Enable DNS prefetch
      if (enablePrefetch) {
        const prefetchDomains = [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ]

        prefetchDomains.forEach(domain => {
          const link = document.createElement('link')
          link.rel = 'dns-prefetch'
          link.href = domain
          document.head.appendChild(link)
        })
      }

      // Enable resource hints for third-party scripts
      const thirdPartyScripts = [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID',
          async: true,
          defer: true
        },
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          async: true
        }
      ]

      thirdPartyScripts.forEach(script => {
        const scriptElement = document.createElement('script')
        scriptElement.src = script.src
        scriptElement.async = script.async
        scriptElement.defer = script.defer
        document.head.appendChild(scriptElement)
      })

      // Enable lazy loading for images
      if (enableLazyLoading) {
        setupImageLazyLoading()
      }

      // Enable bundle analysis
      if (enableBundleAnalysis) {
        setupBundleAnalysis()
      }

      setIsOptimized(true)
    }
  }, [enablePrefetch, enableLazyLoading, enableBundleAnalysis])

  const setupImageLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        (img as HTMLImageElement).loading = 'lazy'
      })
    } else {
      // Fallback for browsers without native lazy loading
      setupIntersectionObserver()
    }
  }

  const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.getAttribute('data-src')
            if (src) {
              img.src = src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => observer.observe(img))
  }

  const setupBundleAnalysis = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analysis enabled')
      // You could integrate with tools like webpack-bundle-analyzer here
    }
  }

  if (!isOptimized) {
    return <>{children}</>
  }

  return <>{children}</>
}

// Optimized Image component
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: 0
      }}
      onLoad={(e) => {
        const target = e.target as HTMLImageElement
        target.style.opacity = '1'
      }}
    />
  )
}

// Lazy Loading wrapper
interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
}

export function LazyLoad({ children, threshold = 0.1, rootMargin = '50px' }: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    const target = document.createElement('div')
    document.body.appendChild(target)
    observer.observe(target)

    return () => {
      observer.unobserve(target)
      document.body.removeChild(target)
    }
  }, [threshold, rootMargin])

  return isVisible ? <>{children}</> : null
}

// Performance monitoring component
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Load time
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationTiming) {
        setMetrics(prev => ({ ...prev, loadTime: navigationTiming.loadEventEnd - navigationTiming.fetchStart }))
      }

      // First Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, firstContentfulPaint: entry.startTime }))
          }
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, largestContentfulPaint: lastEntry.startTime }))
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const firstInput = entries[0]
        if (firstInput) {
          setMetrics(prev => ({ ...prev, firstInputDelay: firstInput.processingStart - firstInput.startTime }))
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach(entry => {
          setMetrics(prev => ({ ...prev, cumulativeLayoutShift: prev.cumulativeLayoutShift + (entry as any).value }))
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      return () => {
        paintObserver.disconnect()
        lcpObserver.disconnect()
        fidObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return (
    <div className="hidden">
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key}>
          {key}: {value.toFixed(2)}ms
        </div>
      ))}
    </div>
  )
}

// Preconnect component for performance optimization
interface PreconnectProps {
  href: string
  as?: string
  crossOrigin?: string
}

export function Preconnect({ href, as = 'script', crossOrigin = 'anonymous' }: PreconnectProps) {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    link.as = as
    link.crossOrigin = crossOrigin
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [href, as, crossOrigin])

  return null
}