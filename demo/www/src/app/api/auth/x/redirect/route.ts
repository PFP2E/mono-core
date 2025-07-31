// src/app/api/auth/x/redirect/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'
import { randomBytes, createHash } from 'crypto'

// Helper to generate a random string
const generateRandomString = (length: number): string => {
  return randomBytes(length).toString('hex')
}

// Helper to generate PKCE codes
const generatePKCE = (verifier: string): string => {
  return createHash('sha256').update(verifier).digest('base64url')
}

export async function GET(_req: NextRequest) {
  const state = generateRandomString(16)
  const codeVerifier = generateRandomString(32)
  const codeChallenge = generatePKCE(codeVerifier)

  const cookiesStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookiesStore,
    sessionOptions
  )
  session.xState = state
  session.xCodeVerifier = codeVerifier
  await session.save()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID!,
    redirect_uri: `${process.env.APP_URL}/api/auth/x/callback`,
    scope: 'users.read tweet.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })

  const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`

  return NextResponse.redirect(authUrl)
}
