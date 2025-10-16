import { NextRequest, NextResponse } from 'next/server'
import { getEnvironmentServices, checkServiceHealth } from '@/config/services'

export async function GET(request: NextRequest) {
  try {
    const services = getEnvironmentServices()
    const health = await checkServiceHealth(services)
    
    return NextResponse.json({
      ...health,
      environment: process.env.NODE_ENV,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error checking service health:', error)
    return NextResponse.json(
      { error: 'Failed to check service health' },
      { status: 500 }
    )
  }
}