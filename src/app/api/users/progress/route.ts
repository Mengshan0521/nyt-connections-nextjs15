import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gameDataOperations } from '@/lib/dataManager'
import { dataValidation } from '@/lib/dataManager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const puzzleId = searchParams.get('puzzleId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()
    if (userId && puzzleId) {
      // Get specific progress
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('puzzle_id', puzzleId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Progress not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    } else if (userId) {
      // Get user's all progress
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch user progress' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        data,
        count: data.length,
        limit,
        offset
      })
    } else {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, puzzleId, progress } = body

    // Validate input
    if (!userId || !puzzleId || !progress) {
      return NextResponse.json(
        { error: 'User ID, puzzle ID, and progress are required' },
        { status: 400 }
      )
    }

    if (!dataValidation.validateSession({ user_id: userId, puzzle_id: puzzleId })) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedProgress = dataValidation.sanitize(progress)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        puzzle_id: puzzleId,
        ...sanitizedProgress,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,puzzle_id'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save progress' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error saving user progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const puzzleId = searchParams.get('puzzleId')

    if (!userId || !puzzleId) {
      return NextResponse.json(
        { error: 'User ID and puzzle ID are required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { progress } = body

    if (!progress) {
      return NextResponse.json(
        { error: 'Progress data is required' },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitizedProgress = dataValidation.sanitize(progress)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_progress')
      .update({
        ...sanitizedProgress,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('puzzle_id', puzzleId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const puzzleId = searchParams.get('puzzleId')

    if (!userId || !puzzleId) {
      return NextResponse.json(
        { error: 'User ID and puzzle ID are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId)
      .eq('puzzle_id', puzzleId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}