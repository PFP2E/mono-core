// src/app/api/me/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'
import logger from '@/lib/logger'

export async function GET(_req: NextRequest) {
  const cookiesStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookiesStore,
    sessionOptions
  )

  const userData = {
    siwe: session.siwe || null,
    x: session.x || null,
    ens: session.ens || null
  }

  logger.debug('Returning user session data.', {
    address: userData.siwe?.address,
    x_username: userData.x?.username,
    ens_name: userData.ens?.name
  })

  return NextResponse.json(userData)
}
