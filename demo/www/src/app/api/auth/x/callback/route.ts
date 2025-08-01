// src/app/api/auth/x/callback/route.ts
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sessionOptions, SessionData } from '@/lib/session'
import logger from '@/lib/logger'

async function parseErrorResponse(
  response: Response
): Promise<object | string> {
  try {
    return await response.json()
  } catch (error) {
    logger.error('Failed to parse error response as JSON.', { error })
    return await response.text()
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  logger.debug('X Auth Callback: Received request.', { code, state })

  const cookiesStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookiesStore,
    sessionOptions
  )

  if (session.x?.accessToken) {
    logger.debug('X Auth Callback: User already has a session. Redirecting.')
    return NextResponse.redirect(process.env.APP_URL!)
  }

  if (!code || !state || state !== session.xState) {
    logger.error('X Auth Callback: Invalid state or code.', {
      receivedState: state,
      expectedState: session.xState
    })
    return NextResponse.json(
      { error: 'Invalid state or code' },
      { status: 400 }
    )
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: `${process.env.APP_URL}/api/auth/x/callback`,
    client_id: process.env.X_CLIENT_ID!,
    code_verifier: session.xCodeVerifier!
  })

  try {
    logger.debug('X Auth Callback: Requesting access token.')
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
      const errorPayload = await parseErrorResponse(tokenResponse)
      logger.error('X Auth Callback: Failed to fetch access token from X.', {
        status: tokenResponse.status,
        error: errorPayload
      })
      return NextResponse.json(
        {
          error: 'Failed to fetch access token',
          details: errorPayload
        },
        { status: tokenResponse.status }
      )
    }

    const tokenData = await tokenResponse.json()
    logger.debug('X Auth Callback: Successfully received token data.')

    const { access_token, refresh_token, expires_in } = tokenData
    const tokenExpiresAt = Date.now() + expires_in * 1000

    let username: string | undefined = 'X User'
    let pfpUrl: string | undefined = undefined

    try {
      logger.debug('X Auth Callback: Requesting user data.')
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

      if (userResponse.ok) {
        const { data: userData } = await userResponse.json()
        logger.debug('X Auth Callback: Successfully received user data.', {
          username: userData.username
        })
        username = userData.username
        pfpUrl = userData.profile_image_url
          ? userData.profile_image_url.replace('_normal', '_400x400')
          : undefined
      } else {
        const errorPayload = await parseErrorResponse(userResponse)
        logger.error('X Auth Callback: Failed to fetch user data from X.', {
          status: userResponse.status,
          error: errorPayload
        })
      }
    } catch (fetchError) {
      logger.error(
        'X Auth Callback: An exception occurred while fetching user data.',
        {
          error: fetchError
        }
      )
    }

    session.x = {
      username,
      pfpUrl,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiresAt
    }

    session.xState = undefined
    session.xCodeVerifier = undefined

    await session.save()
    logger.info(
      `X Auth Callback: Successfully created session for user ${username}.`
    )

    return NextResponse.redirect(process.env.APP_URL!)
  } catch (error) {
    logger.error('X Auth Callback: A catch-all error occurred.', {
      error: error instanceof Error ? error.message : JSON.stringify(error)
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
