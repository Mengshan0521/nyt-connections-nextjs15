import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the error for debugging
    console.error('Monitoring Error:', {
      message: body.error?.message,
      filename: body.error?.filename,
      timestamp: body.timestamp,
      url: body.url
    })
    
    // In production, you might want to send this to a monitoring service
    // like Sentry, LogRocket, or your own analytics service
    
    return NextResponse.json({ success: true, timestamp: Date.now() })
  } catch (error) {
    console.error('Error handling monitoring error:', error)
    return NextResponse.json(
      { error: 'Failed to handle error' },
      { status: 500 }
    )
  }
}