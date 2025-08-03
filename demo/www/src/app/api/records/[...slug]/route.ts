// src/app/api/records/[...slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

const RECORDS_API_URL = process.env.RECORDS_API_URL || 'http://localhost:8787'

async function handler(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const path = params.slug.join('/')
  const url = `${RECORDS_API_URL}/v1/${path}`

  logger.info(`Proxying request to records API: ${url}`)

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      // Pass body only for relevant methods
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error(`Error from records API: ${response.status}`, data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Failed to proxy request to records API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
