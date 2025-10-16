import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gameDataOperations } from '@/lib/dataManager'
import { dataValidation } from '@/lib/dataManager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit') || '1')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    if (date) {
      // Get specific date's game
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('date', date)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Game not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    } else {
      // Get latest games
      const { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch games' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        data,
        count: data.length,
        limit,
        offset
      })
    }
  } catch (error) {
    console.error('Error fetching game data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input data
    if (!dataValidation.validateGameData(body)) {
      return NextResponse.json(
        { error: 'Invalid game data format' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedData = dataValidation.sanitize(body)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('puzzles')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create game' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate input data
    if (!dataValidation.validateGameData(body)) {
      return NextResponse.json(
        { error: 'Invalid game data format' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedData = dataValidation.sanitize(body)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('puzzles')
      .update(sanitizedData)
      .eq('date', date)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}