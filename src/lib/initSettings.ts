const { Connection, Keypair, SystemProgram } = require("@solana/web3.js");
const { AnchorProvider, Program, Wallet } = require("@coral-xyz/anchor");
const config = require("/Users/bibibi/.config/solana/id.json");
const IDL = require("../../anchor/target/idl/chkn.json");
const anchor = require("@coral-xyz/anchor");

async function initializeSettings() {
    const keypair = Keypair.fromSecretKey(Uint8Array.from(config));
    const wallet = new Wallet(keypair);
    const provider = new AnchorProvider(
        new Connection("https://api.devnet.solana.com"),
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
        console.log("Existing settings found:", {
            priceIndividualMonthly: settings.priceIndividualMonthly.toNumber() / anchor.web3.LAMPORTS_PER_SOL + " SOL",
            priceIndividualYearly: settings.priceIndividualYearly.toNumber() / anchor.web3.LAMPORTS_PER_SOL + " SOL",
            priceGroupMonthly: settings.priceGroupMonthly.toNumber() / anchor.web3.LAMPORTS_PER_SOL + " SOL",
            priceGroupYearly: settings.priceGroupYearly.toNumber() / anchor.web3.LAMPORTS_PER_SOL + " SOL",
        });
    } catch (e) {
        console.log("No settings found, initializing...");
        await program.methods.initializingSettings().accounts({
            payer: keypair.publicKey,
            systemProgram: SystemProgram.programId,
            settings: settingsAccount,
        }).rpc();
        console.log("Settings initialized");
    }
}

initializeSettings().catch(console.error);
