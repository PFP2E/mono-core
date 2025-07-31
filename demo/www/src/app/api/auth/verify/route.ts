// src/app/api/auth/verify/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { sessionOptions, SessionData } from '@/lib/session'

export async function POST(req: NextRequest) {
  const cookiesStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookiesStore,
    sessionOptions
  )
  const { message, signature } = await req.json()

  try {
    const siweMessage = new SiweMessage(message)
    const { data: fields } = await siweMessage.verify({
      signature,
      nonce: session.nonce
    })

    if (fields.nonce !== session.nonce) {
      return new NextResponse('Invalid nonce.', { status: 422 })
    }

    session.siwe = fields
    await session.save()

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return new NextResponse(String(error), { status: 400 })
  }
}
