'use client'

import { useEffect, useState } from 'react'
import { getEnvironmentServices } from '@/config/services'
import ConsentBanner from '@/features/consent/components/ConsentBanner'
import AnalyticsProvider from '@/features/analytics/components/AnalyticsProvider'
import AdSenseScript from '@/features/ads/components/AdSenseScript'
import MonitoringScript from '@/features/monitoring/components/MonitoringScript'

interface ServiceProviderProps {
  gaId?: string
  adsenseId?: string
  monitoringId?: string
}

export default function EnhancedServiceProvider({
  gaId,
  adsenseId,
  monitoringId
}: ServiceProviderProps) {
  const [services, setServices] = useState(getEnvironmentServices())
  const [consentLoaded, setConsentLoaded] = useState(false)

  // Update services when environment changes
  useEffect(() => {
    const updateServices = () => {
      setServices(getEnvironmentServices())
    }
    
    // Listen for consent changes
    const handleConsentChange = () => {
      setConsentLoaded(true)
      // Re-evaluate services after consent
      setTimeout(updateServices, 100)
    }
    
    window.addEventListener('consent-change', handleConsentChange)
    return () => window.removeEventListener('consent-change', handleConsentChange)
  }, [])

  // Load consent script if needed
  useEffect(() => {
    if (!consentLoaded && services.consent.enabled) {
      const script = document.createElement('script')
      script.src = '/scripts/consent-manager.js'
      script.async = true
      script.onload = () => setConsentLoaded(true)
      document.head.appendChild(script)
    }
  }, [consentLoaded, services.consent.enabled])

  const renderServiceComponents = () => {
    const components = []

    // Analytics
    if (services.analytics.enabled && gaId) {
      components.push(
        <AnalyticsProvider 
          key="analytics" 
          gaId={gaId} 
          options={services.analytics.options}
        />
      )
    }

    // Advertising
    if (services.advertising.enabled && adsenseId) {
      components.push(
        <AdSenseScript 
          key="advertising" 
          adsenseId={adsenseId} 
          options={services.advertising.options}
        />
      )
    }

    // Monitoring
    if (services.monitoring.enabled && monitoringId) {
      components.push(
        <MonitoringScript 
          key="monitoring" 
          monitoringId={monitoringId} 
          options={services.monitoring.options}
        />
      )
    }

    return components
  }

  return (
    <>
      {/* Cookie consent banner */}
      {services.consent.enabled && <ConsentBanner />}
      
      {/* Service scripts */}
      {renderServiceComponents()}
    </>
  )
}

// Service status component for debugging
export function ServiceStatus() {
  const [services, setServices] = useState(getEnvironmentServices())
  const [health, setHealth] = useState<{services: Record<string, boolean>, timestamp: number} | null>(null)

  useEffect(() => {
    // Update services periodically
    const interval = setInterval(() => {
      setServices(getEnvironmentServices())
      // Check health every 5 minutes
      if (Date.now() - (health?.timestamp || 0) > 300000) {
        checkHealth()
      }
    }, 60000)

    const checkHealth = async () => {
      try {
        const response = await fetch('/api/services/health')
        const data = await response.json()
        setHealth(data)
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }

    checkHealth()

    return () => clearInterval(interval)
  }, [health?.timestamp])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">Service Status</div>
      {Object.entries(services).map(([name, config]) => (
        <div key={name} className="flex items-center gap-2">
          <span className={config.enabled ? 'text-green-400' : 'text-red-400'}>
            {config.enabled ? '✓' : '✗'}
          </span>
          <span>{name}</span>
          {health?.services[name] && (
            <span className="text-blue-400">
              ({health.services[name] ? 'OK' : 'ERROR'})
            </span>
          )}
        </div>
      ))}
    </div>
  )
}