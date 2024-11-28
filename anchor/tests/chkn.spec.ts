import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Chkn} from '../target/types/chkn'

describe('chkn', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Chkn as Program<Chkn>

  const chknKeypair = Keypair.generate()

  it('Initialize Chkn', async () => {
    await program.methods
      .initialize()
      .accounts({
        chkn: chknKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([chknKeypair])
      .rpc()

    const currentCount = await program.account.chkn.fetch(chknKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Chkn', async () => {
    await program.methods.increment().accounts({ chkn: chknKeypair.publicKey }).rpc()

    const currentCount = await program.account.chkn.fetch(chknKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Chkn Again', async () => {
    await program.methods.increment().accounts({ chkn: chknKeypair.publicKey }).rpc()

    const currentCount = await program.account.chkn.fetch(chknKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Chkn', async () => {
    await program.methods.decrement().accounts({ chkn: chknKeypair.publicKey }).rpc()

    const currentCount = await program.account.chkn.fetch(chknKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set chkn value', async () => {
    await program.methods.set(42).accounts({ chkn: chknKeypair.publicKey }).rpc()

    const currentCount = await program.account.chkn.fetch(chknKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the chkn account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        chkn: chknKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.chkn.fetchNullable(chknKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
