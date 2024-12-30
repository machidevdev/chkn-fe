import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
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
  const newOwner = Keypair.generate().publicKey


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

      await sleep(1000) // Add delay after transaction

      const settings = await program.account.settings.fetch(settingsPda)
      
      assert.strictEqual(settings.owner.toString(), owner.toString())
      assert.strictEqual(
        settings.priceIndividualMonthly.toString(),
        (LAMPORTS_PER_SOL / 100).toString()
      )
      assert.strictEqual(
        settings.priceIndividualYearly.toString(),
        (10 * LAMPORTS_PER_SOL / 100).toString()
      )
      assert.strictEqual(
        settings.priceGroupMonthly.toString(),
        (5 * LAMPORTS_PER_SOL / 100).toString()
      )
      assert.strictEqual(
        settings.priceGroupYearly.toString(),
        (40 * LAMPORTS_PER_SOL / 100).toString()
      )
    })
  })

  it('Updates settings', async () => {
    await retryOnRateLimit(async () => {
      const newSettings = {
        owner: newOwner,
        priceIndividualMonthly: new anchor.BN(2 * LAMPORTS_PER_SOL / 100),
        priceIndividualYearly: new anchor.BN(20 * LAMPORTS_PER_SOL / 100),
        priceGroupMonthly: new anchor.BN(10 * LAMPORTS_PER_SOL / 100),
        priceGroupYearly: new anchor.BN(80 * LAMPORTS_PER_SOL / 100),
      }

      await program.methods
        .updateSettings(newSettings)
        .accounts({
          settings: settingsPda,
          owner: owner,
        })
        .rpc()

      await sleep(1000) // Add delay after transaction

      const settings = await program.account.settings.fetch(settingsPda)
      assert.strictEqual(settings.owner.toString(), newOwner.toString())
      assert.strictEqual(
        settings.priceIndividualMonthly.toString(),
        newSettings.priceIndividualMonthly.toString()
      )
    })
  })

  it('Fails to update settings with wrong owner', async () => {
    await retryOnRateLimit(async () => {
      const wrongOwner = Keypair.generate()
      const newSettings = {
        owner: owner,
        priceIndividualMonthly: new anchor.BN(LAMPORTS_PER_SOL / 100),
        priceIndividualYearly: new anchor.BN(10 * LAMPORTS_PER_SOL / 100),
        priceGroupMonthly: new anchor.BN(5 * LAMPORTS_PER_SOL / 100),
        priceGroupYearly: new anchor.BN(40 * LAMPORTS_PER_SOL / 100),
      }

      try {
        await program.methods
          .updateSettings(newSettings)
          .accounts({
            settings: settingsPda,
            owner: wrongOwner.publicKey,
          })
          .signers([wrongOwner])
          .rpc()
        assert.fail('Should have failed with wrong owner')
      } catch (error: any) {
        assert.strictEqual(error.error.errorCode.code, 'NotOwner')
      }
    })
  })

  it('Processes payment correctly', async () => {
    await retryOnRateLimit(async () => {
      const payer = Keypair.generate()
      const amount = new anchor.BN(2* LAMPORTS_PER_SOL / 100) // 0.01 SOL

      // Airdrop some SOL to the payer
      const signature = await provider.connection.requestAirdrop(
        payer.publicKey,
        LAMPORTS_PER_SOL
      )
      await provider.connection.confirmTransaction(signature)
      await sleep(1000) // Add delay after airdrop

      const initialBalance = await provider.connection.getBalance(newOwner)

      await program.methods
        .processPayment(amount)
        .accounts({
          payer: payer.publicKey,
          receiver: newOwner,
        })
        .signers([payer])
        .rpc()

      await sleep(1000) // Add delay after transaction

      const finalBalance = await provider.connection.getBalance(newOwner)
      assert.strictEqual(finalBalance - initialBalance, amount.toNumber())
    })
  })

  it('Fails payment with insufficient funds', async () => {
    await retryOnRateLimit(async () => {
      const poorPayer = Keypair.generate()
      const amount = new anchor.BN(2* LAMPORTS_PER_SOL / 100) // 1 SOL

      try {
        await program.methods
          .processPayment(amount)
          .accounts({
            payer: poorPayer.publicKey,
            receiver: newOwner,
          })
          .signers([poorPayer])
          .rpc()
        assert.fail('Should have failed with insufficient funds')
      } catch (error: any) {
        assert(error?.message?.includes('custom program error: 0x1770') || 
               error?.message?.includes('InsufficientFunds'),
               'Expected InsufficientFunds error')
      }
    })
  })
})
