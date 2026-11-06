import { NextResponse } from 'next/server'
import { getAuthenticatedUser, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const userPayload = await getAuthenticatedUser()
  if (!userPayload) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    res.cookies.delete(COOKIE_NAME)
    return res
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.id },
    select: { id: true, email: true },
  })

  if (!user) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    res.cookies.delete(COOKIE_NAME)
    return res
  }

  return NextResponse.json({ id: user.id, email: user.email })
}
