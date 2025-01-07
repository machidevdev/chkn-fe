import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
import { Chkn } from '../target/types/chkn'
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import assert from 'assert'

// Helper function to add delay between requests
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to retry on rate limit
const retryOnRateLimit = async (fn: () => Promise<void>) => {
  try {
    await fn()
  } catch (error: any) {
    if (error?.message?.includes('429')) {
      await sleep(2000) // Longer delay on rate limit
      // Retry once
      await fn()
    } else {
      throw error
    }
  }
}

describe('chkn', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Chkn as Program<Chkn>
  const owner = provider.wallet.publicKey
  let settingsPda: PublicKey

  beforeAll(async () => {
    // Find PDA for settings
    [settingsPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('settings')],
      program.programId,
    )
  })


  it('Initializes settings', async () => {
    await retryOnRateLimit(async () => {
      await program.methods
        .initializingSettings()
        .accounts([{
          payer: owner,
          systemProgram: anchor.web3.SystemProgram.programId,
          settings: settingsPda,
        }])
        .rpc()
    })
  })


  it('Initializes telegram pda', async () => {
    const formattedTelegramId = new BN(1234567890)
    const seeds = [formattedTelegramId.toArrayLike(Buffer, 'le', 8)]
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId,
    )
    
    await program.methods
      .initializePda(formattedTelegramId)
      .accounts([{
        signer: owner,
        pda: pda,
        systemProgram: anchor.web3.SystemProgram.programId
      }])
      .rpc()
  })
  
  it('Processes payment', async () => {
    const formattedTelegramId = new BN(1234567890)
    const seeds = [formattedTelegramId.toArrayLike(Buffer, 'le', 8)]
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId,
    )

    const airdropTx = await provider.connection.requestAirdrop(pda, 1 * LAMPORTS_PER_SOL)
    await provider.connection.confirmTransaction(airdropTx)

    const initialBalance = await provider.connection.getBalance(pda)

    const paymentAmount = new BN(1 * LAMPORTS_PER_SOL)
    
    await retryOnRateLimit(async () => {
      await program.methods
        .processPayment(paymentAmount)
        .accounts({
          signer: owner,
          pda: pda,
          settings: settingsPda,
        })
        .rpc()
    })
    const finalBalance = await provider.connection.getBalance(pda)
    const difference = initialBalance - finalBalance
    expect(difference).toBe(paymentAmount.toNumber())
  })
  
  it('Tries to process payment with invalid signer', async () => {
    const signer = Keypair.generate()
    const paymentAmount = new BN(1 * LAMPORTS_PER_SOL)
    const formattedTelegramId = new BN(1111)
    const seeds = [formattedTelegramId.toArrayLike(Buffer, 'le', 8)]
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId,
    )
    const airdropTx = await provider.connection.requestAirdrop(pda, 1 * LAMPORTS_PER_SOL)
    await provider.connection.confirmTransaction(airdropTx)

    
    await program.methods.processPayment(paymentAmount).accounts({
      signer: signer.publicKey,
      pda: pda,
      settings: settingsPda,
    }).rpc().catch((error) => {
      expect(error).toBeDefined()
    })
  })


  

 
})
