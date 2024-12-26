-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScanType" AS ENUM ('SCAN', 'FIRST');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Swap" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slot" INTEGER,
    "timestamp" BIGINT NOT NULL,
    "tx" TEXT NOT NULL,
    "buyMint" TEXT NOT NULL,
    "buyAmount" DECIMAL(65,30) NOT NULL,
    "buyDecimals" INTEGER NOT NULL,
    "buyAmountUI" TEXT NOT NULL,
    "sellMint" TEXT NOT NULL,
    "sellAmount" DECIMAL(65,30) NOT NULL,
    "sellDecimals" INTEGER NOT NULL,
    "sellAmountUI" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Swap_pkey" PRIMARY KEY ("id","timestamp")
);

-- CreateTable
CREATE TABLE "NewPair" (
    "id" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "tx" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "baseMint" TEXT NOT NULL,
    "quoteMint" TEXT NOT NULL,
    "baseReserve" DECIMAL(65,30) NOT NULL,
    "baseDecimals" INTEGER NOT NULL,
    "uiBaseReserve" TEXT NOT NULL,
    "quoteReserve" DECIMAL(65,30) NOT NULL,
    "quoteDecimals" INTEGER NOT NULL,
    "uiQuoteReserve" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "openTime" BIGINT,
    "lpDecimals" INTEGER,
    "lpMint" TEXT,
    "lpReserve" DECIMAL(65,30),
    "slot" INTEGER,

    CONSTRAINT "NewPair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidityEvent" (
    "id" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "tx" TEXT NOT NULL,
    "maker" TEXT NOT NULL,
    "add" BOOLEAN NOT NULL,
    "amountA" DECIMAL(65,30) NOT NULL,
    "uiAmountA" TEXT NOT NULL,
    "decimalsA" INTEGER NOT NULL,
    "mintA" TEXT NOT NULL,
    "amountB" DECIMAL(65,30) NOT NULL,
    "uiAmountB" TEXT NOT NULL,
    "decimalsB" INTEGER NOT NULL,
    "mintB" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "slot" INTEGER,

    CONSTRAINT "LiquidityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MintBurnEvent" (
    "id" TEXT NOT NULL,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "mint" TEXT NOT NULL,
    "isMint" BOOLEAN NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "maker" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "slot" INTEGER,

    CONSTRAINT "MintBurnEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreateEvent" (
    "id" TEXT NOT NULL,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "source" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "slot" INTEGER,

    CONSTRAINT "CreateEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloseEvent" (
    "id" TEXT NOT NULL,
    "slot" INTEGER,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "owner" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "CloseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "authority" TEXT,
    "maker" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "hash" TEXT NOT NULL,
    "mint" TEXT,
    "slot" INTEGER,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParsedTransfer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slot" INTEGER,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "maker" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "ParsedTransfer_pkey" PRIMARY KEY ("id","timestamp")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "mint" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "uiTokenAmount" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "decimals" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenBalance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mint" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "balances" JSONB NOT NULL,

    CONSTRAINT "TokenBalance_pkey" PRIMARY KEY ("id","timestamp")
);

-- CreateTable
CREATE TABLE "TokenInfo" (
    "id" TEXT NOT NULL,
    "mint" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "telegram" TEXT,
    "isMutable" BOOLEAN NOT NULL,
    "metadataAddress" TEXT,
    "mintAuthority" TEXT,
    "freezeAuthority" TEXT,
    "updateAuthority" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "data" BYTEA NOT NULL,

    CONSTRAINT "DataSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowedWallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowedWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "isPaper" BOOLEAN NOT NULL,
    "strategyName" TEXT NOT NULL,
    "entryTimestamp" TIMESTAMP(3) NOT NULL,
    "exitTimestamp" TIMESTAMP(3),
    "entryTimestampExecuted" TIMESTAMP(3),
    "exitTimestampExecuted" TIMESTAMP(3),
    "entryPrice" DECIMAL(65,30) NOT NULL,
    "exitPrice" DECIMAL(65,30),
    "amount" DECIMAL(65,30) NOT NULL,
    "tokenMint" TEXT NOT NULL,
    "status" "TradeStatus" NOT NULL,
    "profitLoss" DECIMAL(65,30),
    "entryTransaction" TEXT,
    "exitTransaction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserState" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "command" TEXT,
    "step" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "address" VARCHAR(44) NOT NULL,
    "txHash" VARCHAR(88) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "address" VARCHAR(44) NOT NULL,
    "txHash" VARCHAR(88) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("txHash")
);

-- CreateTable
CREATE TABLE "Otp" (
    "code" CHAR(6) NOT NULL,
    "telegramId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "mint" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "marketCap" DECIMAL(65,30) NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatToUser" (
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "ChatToUser_pkey" PRIMARY KEY ("userId","chatId")
);

-- CreateTable
CREATE TABLE "PairReserves" (
    "id" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "tx" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "mint" TEXT NOT NULL,
    "wsolAmount" DECIMAL(65,30) NOT NULL,
    "wsolUIAmount" TEXT NOT NULL,
    "tokenAmount" DECIMAL(65,30) NOT NULL,
    "tokenUIAmount" TEXT NOT NULL,
    "tokenDecimals" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PairReserves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" SERIAL NOT NULL,
    "type" "ScanType" NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "tokenMint" TEXT NOT NULL,
    "startRange" TIMESTAMP(3),
    "endRange" TIMESTAMP(3),
    "transactions" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ScanStatus" NOT NULL,
    "analysis" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Swap_timestamp_idx" ON "Swap"("timestamp");

-- CreateIndex
CREATE INDEX "Swap_buyMint_sellMint_idx" ON "Swap"("buyMint", "sellMint");

-- CreateIndex
CREATE INDEX "Swap_maker_idx" ON "Swap"("maker");

-- CreateIndex
CREATE INDEX "Swap_buyMint_idx" ON "Swap"("buyMint");

-- CreateIndex
CREATE INDEX "Swap_sellMint_idx" ON "Swap"("sellMint");

-- CreateIndex
CREATE INDEX "Swap_maker_buyMint_idx" ON "Swap"("maker", "buyMint");

-- CreateIndex
CREATE INDEX "Swap_maker_sellMint_idx" ON "Swap"("maker", "sellMint");

-- CreateIndex
CREATE INDEX "NewPair_timestamp_idx" ON "NewPair"("timestamp");

-- CreateIndex
CREATE INDEX "NewPair_baseMint_quoteMint_idx" ON "NewPair"("baseMint", "quoteMint");

-- CreateIndex
CREATE INDEX "LiquidityEvent_timestamp_idx" ON "LiquidityEvent"("timestamp");

-- CreateIndex
CREATE INDEX "MintBurnEvent_timestamp_idx" ON "MintBurnEvent"("timestamp");

-- CreateIndex
CREATE INDEX "MintBurnEvent_mint_idx" ON "MintBurnEvent"("mint");

-- CreateIndex
CREATE INDEX "CreateEvent_timestamp_idx" ON "CreateEvent"("timestamp");

-- CreateIndex
CREATE INDEX "CreateEvent_mint_idx" ON "CreateEvent"("mint");

-- CreateIndex
CREATE INDEX "CreateEvent_source_idx" ON "CreateEvent"("source");

-- CreateIndex
CREATE INDEX "CreateEvent_account_idx" ON "CreateEvent"("account");

-- CreateIndex
CREATE INDEX "CloseEvent_timestamp_idx" ON "CloseEvent"("timestamp");

-- CreateIndex
CREATE INDEX "CloseEvent_owner_idx" ON "CloseEvent"("owner");

-- CreateIndex
CREATE INDEX "CloseEvent_account_idx" ON "CloseEvent"("account");

-- CreateIndex
CREATE INDEX "Transfer_timestamp_idx" ON "Transfer"("timestamp");

-- CreateIndex
CREATE INDEX "Transfer_from_to_idx" ON "Transfer"("from", "to");

-- CreateIndex
CREATE INDEX "ParsedTransfer_timestamp_idx" ON "ParsedTransfer"("timestamp");

-- CreateIndex
CREATE INDEX "ParsedTransfer_mint_idx" ON "ParsedTransfer"("mint");

-- CreateIndex
CREATE INDEX "ParsedTransfer_from_to_idx" ON "ParsedTransfer"("from", "to");

-- CreateIndex
CREATE UNIQUE INDEX "Balance_hash_key" ON "Balance"("hash");

-- CreateIndex
CREATE INDEX "Balance_timestamp_idx" ON "Balance"("timestamp");

-- CreateIndex
CREATE INDEX "Balance_mint_idx" ON "Balance"("mint");

-- CreateIndex
CREATE INDEX "Balance_owner_idx" ON "Balance"("owner");

-- CreateIndex
CREATE INDEX "Balance_mint_owner_idx" ON "Balance"("mint", "owner");

-- CreateIndex
CREATE INDEX "TokenBalance_mint_idx" ON "TokenBalance"("mint");

-- CreateIndex
CREATE UNIQUE INDEX "TokenInfo_mint_key" ON "TokenInfo"("mint");

-- CreateIndex
CREATE INDEX "TokenInfo_mint_idx" ON "TokenInfo"("mint");

-- CreateIndex
CREATE INDEX "TokenInfo_symbol_idx" ON "TokenInfo"("symbol");

-- CreateIndex
CREATE INDEX "DataSnapshot_snapshotType_timestamp_idx" ON "DataSnapshot"("snapshotType", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "FollowedWallet_address_key" ON "FollowedWallet"("address");

-- CreateIndex
CREATE INDEX "FollowedWallet_address_idx" ON "FollowedWallet"("address");

-- CreateIndex
CREATE INDEX "Trade_strategyName_idx" ON "Trade"("strategyName");

-- CreateIndex
CREATE INDEX "Trade_entryTimestamp_idx" ON "Trade"("entryTimestamp");

-- CreateIndex
CREATE INDEX "Trade_tokenMint_idx" ON "Trade"("tokenMint");

-- CreateIndex
CREATE INDEX "Trade_status_idx" ON "Trade"("status");

-- CreateIndex
CREATE INDEX "Trade_isPaper_idx" ON "Trade"("isPaper");

-- CreateIndex
CREATE UNIQUE INDEX "UserState_chatId_userId_key" ON "UserState"("chatId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_code_key" ON "Otp"("code");

-- CreateIndex
CREATE INDEX "Otp_telegramId_idx" ON "Otp"("telegramId");

-- CreateIndex
CREATE INDEX "Otp_code_idx" ON "Otp"("code");

-- CreateIndex
CREATE INDEX "PairReserves_timestamp_idx" ON "PairReserves"("timestamp");

-- CreateIndex
CREATE INDEX "PairReserves_mint_idx" ON "PairReserves"("mint");

-- CreateIndex
CREATE INDEX "PairReserves_mint_timestamp_idx" ON "PairReserves"("mint", "timestamp");

-- CreateIndex
CREATE INDEX "Scan_userId_idx" ON "Scan"("userId");

-- CreateIndex
CREATE INDEX "Scan_chatId_idx" ON "Scan"("chatId");

-- CreateIndex
CREATE INDEX "Scan_tokenMint_idx" ON "Scan"("tokenMint");

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_address_fkey" FOREIGN KEY ("address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_address_fkey" FOREIGN KEY ("address") REFERENCES "User"("address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatToUser" ADD CONSTRAINT "ChatToUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatToUser" ADD CONSTRAINT "ChatToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
