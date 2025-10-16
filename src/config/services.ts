// Service configuration for third-party integrations
export interface ServiceConfig {
  enabled: boolean
  id?: string
  region?: string
  apiKey?: string
  baseUrl?: string
  options?: Record<string, any>
}

export interface ThirdPartyServices {
  analytics: ServiceConfig
  advertising: ServiceConfig
  consent: ServiceConfig
  // Add more services as needed
  monitoring?: ServiceConfig
  cdn?: ServiceConfig
  translation?: ServiceConfig
}

export const defaultServices: ThirdPartyServices = {
  analytics: {
    enabled: process.env.NEXT_PUBLIC_GA_ID ? true : false,
    id: process.env.NEXT_PUBLIC_GA_ID,
    options: {
      anonymizeIp: true,
      sendPageView: true,
      trackPageViews: true,
    }
  },
  advertising: {
    enabled: process.env.NEXT_PUBLIC_ADSENSE_ID ? true : false,
    id: process.env.NEXT_PUBLIC_ADSENSE_ID,
    options: {
      pageLevelAds: true,
      autoAds: true,
      testMode: process.env.NODE_ENV !== 'production',
    }
  },
  consent: {
    enabled: true,
    options: {
      cookieName: 'cookie_consent',
      expiresDays: 180,
      autoDetect: true,
      defaultConsent: {
        analytics: false,
        advertising: false,
      }
    }
  },
  monitoring: {
    enabled: process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true',
    id: process.env.NEXT_PUBLIC_MONITORING_ID,
    options: {
      trackErrors: true,
      trackPerformance: true,
      sampleRate: 0.1,
    }
  },
  cdn: {
    enabled: process.env.NEXT_PUBLIC_CDN_ENABLED === 'true',
    baseUrl: process.env.NEXT_PUBLIC_CDN_URL,
    options: {
      cacheControl: 'public, max-age=3600',
    }
  },
  translation: {
    enabled: process.env.NEXT_PUBLIC_TRANSLATION_ENABLED === 'true',
    id: process.env.NEXT_PUBLIC_TRANSLATION_ID,
    options: {
      autoDetect: true,
      cacheDuration: 3600,
    }
  }
}

// Service environment validation
export function validateServiceConfig(services: ThirdPartyServices): ThirdPartyServices {
  const validated = { ...services }
  
  // Validate analytics
  if (validated.analytics.enabled) {
    if (!validated.analytics.id) {
      console.warn('Analytics enabled but no ID provided')
      validated.analytics.enabled = false
    }
  }
  
  // Validate advertising
  if (validated.advertising.enabled) {
    if (!validated.advertising.id) {
      console.warn('Advertising enabled but no ID provided')
      validated.advertising.enabled = false
    }
  }
  
  return validated
}

// Get environment-specific service configuration
export function getEnvironmentServices(): ThirdPartyServices {
  const services = validateServiceConfig(defaultServices)
  
  // Override for development
  if (process.env.NODE_ENV === 'development') {
    services.advertising.options.testMode = true
    services.monitoring.enabled = false // Disable monitoring in dev
  }
  
  return services
}

// Service health check
export async function checkServiceHealth(services: ThirdPartyServices): Promise<{
  services: Record<string, boolean>
  timestamp: number
}> {
  const health: Record<string, boolean> = {}
  
  // Basic health checks
  for (const [name, config] of Object.entries(services)) {
    if (!config.enabled) {
      health[name] = false
      continue
    }
    
    try {
      switch (name) {
        case 'analytics':
          // Check GA ID format
          health[name] = /^UA-\d+-\d+$|^G-\w+$/.test(config.id || '')
          break
        case 'advertising':
          // Check AdSense ID format
          health[name] = /^ca-pub-\d+$/.test(config.id || '')
          break
        case 'consent':
          // Consent service is always available if enabled
          health[name] = true
          break
        default:
          health[name] = true
      }
    } catch (error) {
      console.error(`Health check failed for ${name}:`, error)
      health[name] = false
    }
  }
  
  return {
    services: health,
    timestamp: Date.now()
  }
}