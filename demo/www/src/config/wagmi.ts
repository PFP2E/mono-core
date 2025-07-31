import { config } from './wagmi-config'

export function getConfig() {
  return config
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
