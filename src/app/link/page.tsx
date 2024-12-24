'use client';

import { WalletButton } from '@/components/solana/solana-provider';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { useAccount } from '@/hooks/useAccount';
import { jetBrainsMono } from '@/lib/fonts';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { User } from '@prisma/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui';
import { useQuery } from '@tanstack/react-query';
import { useAtom, atom } from 'jotai';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
const endpoint = 'https://chkn-indexer-production.up.railway.app/api';
const otpAtom = atom<string>('');
const signatureAtom = atom<string | null>(null);

const OtpField = () => {
  const [otp, setOtp] = useAtom(otpAtom);

  return (
    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};

const SubmitButton = () => {
  const wallet = useWallet();
  const [otp] = useAtom(otpAtom);
  const [, setSignature] = useAtom(signatureAtom);

  const handleSubmit = async () => {
    if (!wallet.publicKey || !wallet.signMessage) {
      alert('Please connect your wallet');
      return;
    }

    const messageText = [
      'Verify account ownership',
      `address: ${wallet.publicKey.toString()}`,
      `otp: ${otp}`,
    ].join('\n');

    const message = new TextEncoder().encode(messageText);
    try {
      const signature = await wallet.signMessage(message);
      setSignature(bs58.encode(signature));

      const response = await fetch(`${endpoint}/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: otp,
          signedMessage: bs58.encode(signature),
          pubKey: wallet.publicKey?.toString(),
          message: messageText,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        console.log('Wallet linked successfully');
      } else {
        console.warn('Failed to link wallet');
      }
    } catch (error) {
      console.warn('Failed to link wallet');
    }
  };

  return <Button onClick={() => handleSubmit()}>Submit</Button>;
};

export default function Link() {
  const { publicKey } = useWallet();
  const account = useAccount(publicKey);
  const [signature] = useAtom(signatureAtom);
  const [, setOtp] = useAtom(otpAtom);
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setOtp(code);
    }
  }, [searchParams, setOtp]);

  return (
    <motion.div
      layoutId="page"
      className="max-w-7xl w-full mx-auto pt-6 flex flex-col gap-y-4"
    >
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-semibold">Link</h1>
        <div
          className={`pt-1 ${jetBrainsMono.className} text-muted-foreground`}
        >
          Link your Telegram account
        </div>
      </div>

      {!publicKey && <WalletButton />}
      {account.isLoading && <div>Loading...</div>}
      {account.data && (
        <div className="flex flex-col gap-4">
          <div>
            Telegram ID:{' '}
            {account.data?.user ? (
              account.data.user.telegramId ? (
                'Linked!'
              ) : (
                'Not Linked'
              )
            ) : (
              <span>
                No active subscription. Please{' '}
                <NextLink
                  href="/subscription"
                  className="text-primary hover:underline"
                >
                  subscribe
                </NextLink>{' '}
                to link your account.
              </span>
            )}
          </div>
          {account.data?.user && !account.data.user.telegramId && (
            <div className="flex flex-col gap-4">
              <OtpField />
              <div className="flex gap-4 max-w-sm">
                <SubmitButton />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
