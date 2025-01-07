const { Connection, Keypair, SystemProgram } = require("@solana/web3.js");
const { AnchorProvider, Program, Wallet } = require("@coral-xyz/anchor");
const config = require("/Users/bibibi/.config/solana/id.json");
const IDL = require("../../anchor/target/idl/chkn.json");
const anchor = require("@coral-xyz/anchor");

async function initializeSettings() {
    const keypair = Keypair.fromSecretKey(Uint8Array.from(config));
    const wallet = new Wallet(keypair);
    const provider = new AnchorProvider(
        new Connection("http://127.0.0.1:8899"),
        wallet,
        AnchorProvider.defaultOptions()
    );
  
    const program = new Program(IDL, provider);
    const [settingsAccount] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("settings")],
        program.programId
    );

    try {
        const settings = await program.account.settings.fetch(settingsAccount);
        console.log("Settings found:", settings);
    } catch (e) {
        await program.methods.initializingSettings().accounts({
            payer: keypair.publicKey,
            systemProgram: SystemProgram.programId,
            settings: settingsAccount,
        }).rpc();
        console.log("Settings initialized with owner:", keypair.publicKey.toString());
    }
}

initializeSettings().catch(console.error);
