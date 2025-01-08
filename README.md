# chkn

## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
pnpm install
```

#### Start the web app

```
pnpm dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `pnpm`, eg: `pnpm anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
pnpm anchor keys sync
```

#### Build the program:

```shell
pnpm anchor-build
```

#### Start the test validator with the program deployed:

```shell
pnpm anchor-localnet
```

#### Run the tests

```shell
pnpm anchor-test
```

#### Deploy to Devnet

```shell
pnpm anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```

## To run the whole thing:

- be sure to have solana cli installed and configured to localnet
- if not, run the following command to install and configure it:

```shell
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

- then run the following command to be sure youre in localnet

```shell
solana config set --url localnet
```

- run the following command to start the localnet

```shell
solana-test-validator
```

if you want to see the logs, run the following command in another terminal:

```shell
solana logs
```

Now that we have the localnet running, let's build the contract to see if everything works:

```shell
pnpm run anchor build
```

If everything works, you should see a new keypair in the `anchor/target/deploy` directory

if there is a key mismatch, you can run the following command to sync the program id:

```shell
pnpm run anchor keys sync
```

This will ensure that the program id is correct and the keypair is synced.

Now that the program is built and the keypair is synced, we can deploy the contract to the localnet:

```shell
pnpm run anchor deploy
```

Now that the program is deployed, let's initialize the settings:

```shell
ts-node src/lib/initSettings.ts
```

This will make you owner of the settings account. Everything is set!
