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
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui';
import { useQuery } from '@tanstack/react-query';
import { useAtom, atom } from 'jotai';
import { useEffect, useState } from 'react';
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
    const signature = await wallet.signMessage(message);
    setSignature(bs58.encode(signature));

    try {
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
        alert('Wallet linked successfully');
      } else {
        alert('Failed to link wallet');
      }
    } catch (error) {
      alert('Failed to link wallet');
    }
  };

  return <Button onClick={() => handleSubmit()}>Submit</Button>;
};

const OtpButton = () => {
  const wallet = useWallet();
  const [, setOtp] = useAtom(otpAtom);

  const createOtp = async () => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet');
      return;
    }
    const response = await fetch(`${endpoint}/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramId: wallet.publicKey.toString(),
      }),
    });
    const data = await response.json();
    setOtp(data.data.otp.code);
  };

  return <Button onClick={() => createOtp()}>Create OTP</Button>;
};

export default function Link() {
  const { publicKey } = useWallet();
  const { data } = useAccount(publicKey);
  const [signature] = useAtom(signatureAtom);
  const telegramId = data?.user?.telegramId;
  return (
    <div className="max-w-7xl w-full mx-auto pt-6 flex flex-col gap-y-4">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-semibold">Link</h1>
        <div
          className={`pt-1 ${jetBrainsMono.className} text-muted-foreground`}
        >
          Link your Telegram account
        </div>
      </div>

      {!publicKey && <WalletButton />}
      {publicKey && <div>Telegram ID: {telegramId}</div>}
    </div>
  );
}
