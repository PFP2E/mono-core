// src/lib/session.ts
import type { SessionOptions } from 'iron-session'
import { SiweMessage } from 'siwe'
import { z } from 'zod'

// Zod schema for the session data
export const sessionSchema = z.object({
  siwe: z.custom<SiweMessage>().optional(),
  x: z
    .object({
      username: z.string().optional(),
      pfpUrl: z.string().url().optional().or(z.literal('')),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      tokenExpiresAt: z.number().optional() // Unix timestamp (milliseconds)
    })
    .optional(),
  ens: z
    .object({
      name: z.string().nullable().optional(),
      avatar: z.string().url().nullable().optional()
    })
    .optional(),
  nonce: z.string().optional(),
  xState: z.string().optional(),
  xCodeVerifier: z.string().optional()
})

// Infer the SessionData type from the Zod schema
export type SessionData = z.infer<typeof sessionSchema>

// Extend the IronSessionData interface
declare module 'iron-session' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IronSessionData extends SessionData {}
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'pfp2e-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}
