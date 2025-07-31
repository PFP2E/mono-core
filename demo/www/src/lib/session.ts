// src/lib/session.ts
import type { SessionOptions } from 'iron-session'
import { SiweMessage } from 'siwe'

// Define the shape of the session data
export interface SessionData {
  siwe?: SiweMessage
  x?: {
    username: string
    pfpUrl: string
  }
  nonce?: string
  xState?: string
  xCodeVerifier?: string
}

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
