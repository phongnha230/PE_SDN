import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { ReadingLogService } from '@/features/reading-logs/server/reading-log.service'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre') || undefined
    const favoriteParam = searchParams.get('favorite')
    const favorite = favoriteParam === 'true' ? true : undefined
    const q = searchParams.get('q') || undefined

    const logs = await ReadingLogService.getAll(user.id, { genre, favorite, q })
    return NextResponse.json(logs, { status: 200 })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // Derive owner strictly from logged-in session
    const log = await ReadingLogService.create(user.id, {
      bookTitle: body.bookTitle,
      minutesRead: body.minutesRead,
      genre: body.genre,
      note: body.note,
      readOn: body.readOn,
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status })
  }
}
