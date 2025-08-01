// src/lib/services/ens.service.ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import logger from '@/lib/logger'

// Create a public client to interact with the Ethereum mainnet
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

/**
 * Resolves an Ethereum address to its ENS name and avatar.
 * @param address The Ethereum address to resolve.
 * @returns An object containing the ENS name and avatar URL, or nulls if not found.
 */
export async function getEnsProfile(address: `0x${string}`) {
  logger.debug(`[ENS Service] Starting ENS resolution for address: ${address}`)
  try {
    const ensName = await publicClient.getEnsName({ address })
    if (!ensName) {
      logger.debug(`[ENS Service] No ENS name found for address: ${address}`)
      return { name: null, avatar: null }
    }

    logger.debug(
      `[ENS Service] Found ENS name: ${ensName} for address: ${address}`
    )

    const ensAvatar = await publicClient.getEnsAvatar({ name: ensName })
    logger.debug(
      `[ENS Service] Found ENS avatar: ${ensAvatar} for name: ${ensName}`
    )

    return { name: ensName, avatar: ensAvatar }
  } catch (error) {
    logger.error(
      `[ENS Service] Error resolving ENS profile for ${address}:`,
      error
    )
    return { name: null, avatar: null }
  }
}
