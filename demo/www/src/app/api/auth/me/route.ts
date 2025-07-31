// src/app/api/me/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(_req: NextRequest) {
  const cookiesStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookiesStore,
    sessionOptions
  )

  const userData = {
    siwe: session.siwe || null,
    x: session.x || null
  }

  return NextResponse.json(userData)
}
