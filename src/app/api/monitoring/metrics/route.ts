import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log metrics for debugging
    console.log('Monitoring Metrics:', {
      url: body.url,
      timestamp: body.timestamp,
      loadTime: body.performance?.navigationTiming?.loadTime,
      device: body.performance?.device
    })
    
    // Store metrics in database if needed
    // This could be sent to your analytics service
    
    return NextResponse.json({ success: true, timestamp: Date.now() })
  } catch (error) {
    console.error('Error handling metrics:', error)
    return NextResponse.json(
      { error: 'Failed to handle metrics' },
      { status: 500 }
    )
  }
}