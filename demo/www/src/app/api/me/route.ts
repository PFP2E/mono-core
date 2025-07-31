// src/app/api/me/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'

export async function GET() {
  const cookiesStore = await cookies()
  const session = await getIronSession(cookiesStore, sessionOptions)

  const userData = {
    siwe: session.siwe || null,
    x: session.x || null
  }

  return NextResponse.json(userData)
}
