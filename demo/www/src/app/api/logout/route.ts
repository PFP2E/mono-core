// src/app/api/logout/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const method = searchParams.get('method')

  const session = await getIronSession(cookies(), sessionOptions)

  if (method === 'x') {
    session.x = undefined
    await session.save()
  } else {
    session.destroy()
  }

  // Redirect to home page after logout
  const url = req.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}
