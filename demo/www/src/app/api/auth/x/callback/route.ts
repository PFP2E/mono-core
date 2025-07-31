// src/app/api/auth/x/callback/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions } from '@/lib/session'

export async function GET(req: NextRequest) {
  const cookiesStore = await cookies()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const session = await getIronSession(cookiesStore, sessionOptions)

  if (!code || !state || state !== session.xState) {
    return new NextResponse('Invalid state or code', { status: 400 })
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: `${process.env.APP_URL}/api/auth/x/callback`,
    client_id: process.env.X_CLIENT_ID!,
    code_verifier: session.xCodeVerifier!
  })

  try {
    const tokenResponse = await fetch(
      'https://api.twitter.com/2/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
          ).toString('base64')}`
        },
        body: body.toString()
      }
    )

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      return new NextResponse(`Error fetching token: ${errorText}`, {
        status: tokenResponse.status
      })
    }

    const { access_token } = await tokenResponse.json()

    const userResponse = await fetch(
      'https://api.twitter.com/2/users/me?user.fields=profile_image_url',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'User-Agent': 'pfp2e-app'
        },
        method: 'GET'
      }
    )

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      return new NextResponse(`Error fetching user data: ${errorText}`, {
        status: userResponse.status
      })
    }

    const { data: userData } = await userResponse.json()

    // Get a higher resolution profile image
    const pfpUrl = userData.profile_image_url
      ? userData.profile_image_url.replace('_normal', '_400x400')
      : ''

    session.x = {
      username: userData.username,
      pfpUrl: pfpUrl
    }
    await session.save()

    return NextResponse.redirect(process.env.APP_URL!)
  } catch (error) {
    console.error('Callback error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
