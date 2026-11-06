import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { ReadingLogService } from '@/features/reading-logs/server/reading-log.service'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const log = await ReadingLogService.getById(id, user.id)
    return NextResponse.json(log, { status: 200 })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const updated = await ReadingLogService.update(id, user.id, body)
    return NextResponse.json(updated, { status: 200 })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status })
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const result = await ReadingLogService.delete(id, user.id)
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    const status = error.statusCode || 500
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status })
  }
}
