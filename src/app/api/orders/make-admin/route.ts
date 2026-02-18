// ONE-TIME SETUP — DELETE AFTER USE
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('token') !== 'homespun-admin-2026') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.update({
    where: { email: 'harsh.homespun@gmail.com' },
    data: { role: 'ADMIN' },
    select: { email: true, name: true, role: true },
  })
  return Response.json({ success: true, user })
}
