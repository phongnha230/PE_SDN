import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { ItemService } from '@/features/items/server/item.service'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const updated = await ItemService.toggleStar(id, user.id)

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('PATCH /api/items/[id]/star error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    )
  }
}
