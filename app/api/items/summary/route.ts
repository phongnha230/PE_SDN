import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { ItemService } from '@/features/items/server/item.service'

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || undefined
    const category = searchParams.get('category') || undefined
    const starred = searchParams.get('starred') || undefined

    const summary = await ItemService.getSummary(user.id, { q, category, starred })
    return NextResponse.json(summary)
  } catch (error: any) {
    console.error('GET /api/items/summary error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    )
  }
}
