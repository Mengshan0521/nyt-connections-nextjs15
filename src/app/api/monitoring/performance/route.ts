import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log performance data
    console.log('Performance Data:', {
      type: body.type,
      value: body.value,
      name: body.name,
      timestamp: body.timestamp
    })
    
    // Store or forward to monitoring service
    // This could be used for performance analysis
    
    return NextResponse.json({ success: true, timestamp: Date.now() })
  } catch (error) {
    console.error('Error handling performance data:', error)
    return NextResponse.json(
      { error: 'Failed to handle performance data' },
      { status: 500 }
    )
  }
}