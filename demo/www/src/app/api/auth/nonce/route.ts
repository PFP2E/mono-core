// src/app/api/auth/nonce/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { generateNonce } from 'siwe'
import { sessionOptions } from '@/lib/session'

export async function GET(req: NextRequest) {
  const session = await getIronSession(cookies(), sessionOptions)
  session.nonce = generateNonce()
  await session.save()

  return new NextResponse(session.nonce)
}
