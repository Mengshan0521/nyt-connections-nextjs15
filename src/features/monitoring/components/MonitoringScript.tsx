'use client'

interface MonitoringScriptProps {
  monitoringId?: string
  options?: {
    trackErrors: boolean
    trackPerformance: boolean
    sampleRate: number
  }
}

export default function MonitoringScript({
  monitoringId,
  options = {
    trackErrors: true,
    trackPerformance: true,
    sampleRate: 0.1
  }
}: MonitoringScriptProps) {
  useEffect(() => {
    if (!monitoringId || !options.trackErrors && !options.trackPerformance) {
      return
    }

    // Check if we should sample (for performance)
    if (Math.random() > options.sampleRate) {
      return
    }

    // Error tracking
    if (options.trackErrors) {
      const handleError = (event: ErrorEvent) => {
        if (!monitoringId) return
        
        fetch('/api/monitoring/error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: {
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              stack: event.error?.stack
            },
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          })
        }).catch(console.error)
      }

      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', (event) => {
        handleError(new ErrorEvent('unhandledrejection', {
          error: event.reason
        }))
      })

      return () => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('unhandledrejection', () => {})
      }
    }

    // Performance tracking
    if (options.trackPerformance && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            sendPerformanceMetrics({
              type: 'navigation',
              value: entry.loadEventEnd - entry.fetchStart
            })
          } else if (entry.entryType === 'resource') {
            sendPerformanceMetrics({
              type: 'resource',
              name: entry.name,
              value: entry.duration,
              size: entry.transferSize
            })
          }
        }
      })

      try {
        observer.observe({ entryTypes: ['navigation', 'resource'] })
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error)
      }
    }

    // Send initial page load metrics
    if (document.readyState === 'complete') {
      sendInitialMetrics()
    } else {
      window.addEventListener('load', sendInitialMetrics)
    }

    return () => {
      window.removeEventListener('load', sendInitialMetrics)
    }
  }, [monitoringId, options])

  const sendInitialMetrics = () => {
    if (!monitoringId) return

    const metrics = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      performance: {
        navigationTiming: {
          loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
          domInteractive: window.performance.timing.domInteractive - window.performance.timing.navigationStart,
          firstPaint: getFirstPaintTime()
        },
        connection: navigator.connection || {},
        device: {
          memory: navigator.deviceMemory || undefined,
          cores: navigator.hardwareConcurrency || undefined,
          platform: navigator.platform
        }
      }
    }

    fetch('/api/monitoring/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metrics)
    }).catch(console.error)
  }

  const sendPerformanceMetrics = (data: any) => {
    if (!monitoringId) return

    fetch('/api/monitoring/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        monitoringId,
        url: window.location.href,
        timestamp: Date.now(),
        ...data
      })
    }).catch(console.error)
  }

  const getFirstPaintTime = (): number => {
    // Try to get first paint time from Performance API
    const paintEntries = window.performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint ? (firstPaint as any).startTime : 0
  }

  return null
}