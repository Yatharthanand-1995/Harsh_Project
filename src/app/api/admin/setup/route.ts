// ONE-TIME SETUP ENDPOINT — DELETE THIS FILE AFTER USE
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

const SECRET = 'homespun-admin-2026'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.update({
    where: { email: 'harsh.homespun@gmail.com' },
    data: { role: 'ADMIN' },
    select: { email: true, name: true, role: true },
  })

  return Response.json({ success: true, user })
}
