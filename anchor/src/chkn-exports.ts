// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import ChknIDL from '../target/idl/chkn.json'
import type { Chkn } from '../target/types/chkn'

// Re-export the generated IDL and type
export { Chkn, ChknIDL }

// The programId is imported from the program IDL.
export const CHKN_PROGRAM_ID = new PublicKey(ChknIDL.address)

// This is a helper function to get the Chkn Anchor program.
export function getChknProgram(provider: AnchorProvider) {
  return new Program(ChknIDL as Chkn, provider)
}

// This is a helper function to get the program ID for the Chkn program depending on the cluster.
export function getChknProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Chkn program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return CHKN_PROGRAM_ID
  }
}
