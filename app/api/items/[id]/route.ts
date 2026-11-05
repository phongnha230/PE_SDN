import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { ItemService } from '@/features/items/server/item.service'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const item = await ItemService.getItemById(id, user.id)
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error: any) {
    console.error('GET /api/items/[id] error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updated = await ItemService.updateItem(id, user.id, body)

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('PUT /api/items/[id] error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await ItemService.deleteItem(id, user.id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('DELETE /api/items/[id] error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    )
  }
}
