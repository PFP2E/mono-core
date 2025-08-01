// src/app/api/auth/verify/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { sessionOptions, sessionSchema, SessionData } from '@/lib/session'
import { getEnsProfile } from '@/lib/services/ens.service'
import logger from '@/lib/logger'

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
      logger.warn('SIWE nonce mismatch.', {
        receivedNonce: fields.nonce,
        expectedNonce: session.nonce
      })
      return NextResponse.json({ error: 'Invalid nonce.' }, { status: 422 })
    }

    logger.info(`Successfully verified SIWE signature for ${fields.address}.`)

    // Add SIWE data to the session
    session.siwe = fields

    // Resolve ENS profile
    const ensProfile = await getEnsProfile(fields.address as `0x${string}`)
    session.ens = ensProfile

    // Validate the session data before saving
    const validation = sessionSchema.safeParse(session)
    if (!validation.success) {
      logger.warn(
        'Session data failed validation before saving.',
        validation.error.flatten()
      )
    }

    await session.save()
    logger.info(`Session saved for address ${fields.address}.`)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logger.error('An error occurred during SIWE verification.', {
      error: error instanceof Error ? error.message : JSON.stringify(error)
    })
    return NextResponse.json({ error: 'Verification failed.' }, { status: 400 })
  }
}
