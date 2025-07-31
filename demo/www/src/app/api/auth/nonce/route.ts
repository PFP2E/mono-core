// src/app/api/auth/nonce/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { generateNonce } from 'siwe'
import { sessionOptions, SessionData } from '@/lib/session'

export async function GET(_req: NextRequest) {
  const cookiesStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookiesStore,
    sessionOptions
  )
  session.nonce = generateNonce()
  await session.save()

  return new NextResponse(session.nonce)
}
