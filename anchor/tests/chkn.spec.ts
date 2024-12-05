import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import { Chkn } from '../target/types/chkn'



//this is all wrong
describe('chkn', () => {
  /*const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.Chkn as Program<Chkn>
  const chknKeypair = Keypair.generate()
  const owner = new PublicKey('88Va6RQojZNHx8VpurUz1tL6Ccaf5VpKZffATLFWRJBp');

  (async () => {
    await provider.connection.requestAirdrop(payer.publicKey, 15 * LAMPORTS_PER_SOL)
  })().then(() => {
    console.log('Airdropped 15 sol to chkn keypair')
   })

  it('insufficient funds', async () => {
    try {
      await program.methods.processPayment(new anchor.BN(150)).accounts({
      receiver: owner,
      payer: chknKeypair.publicKey,
      })
      .signers([payer.payer])
      .rpc()
    } catch (e) {
      e instanceof anchor.AnchorError && expect(e.error.errorCode.code).toBe('InvalidAmount')
    }
  })

  it('wrong receiver', async () => {
    try {
      await program.methods.processPayment(new anchor.BN(10)).accounts({
        receiver: payer.publicKey,
        payer: payer.publicKey,
      })
      .signers([payer.payer])
      .rpc()
    } catch (e) {
      e instanceof anchor.AnchorError && expect(e.error.errorCode.code).toBe('InvalidReceiver')
    }
  })

  it('correct payment', async () => {
    try {
      const tx = await program.methods.processPayment(new anchor.BN(1)).accounts({
        receiver: owner,
        payer: payer.publicKey,
      }).signers([payer.payer]).rpc()
      console.log(tx)
    } catch (e) {
      fail(e)
    }
  })
  it('logs correctly', async () => {

    const listener = program.addEventListener('paymentEvent', (event, slot) => {
      console.log(`${event} at slot ${slot}`)
    })
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      const tx = await program.methods.processPayment(new anchor.BN(1)).accounts({
        receiver: owner,
        payer: payer.publicKey,
      }).signers([payer.payer]).rpc()
    } catch (e) {
      fail(e)
    }
    program.removeEventListener(listener)
  })
*/
})
