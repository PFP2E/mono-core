export * from './cn'

// Validate Sui address format (32 bytes / 64 characters hex string starting with 0x)
export function isValidSuiAddress(address: string): boolean {
  const suiAddressRegex = /^0x[a-fA-F0-9]{64}$/
  return suiAddressRegex.test(address)
}
