'use client';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { useWallet } from '@solana/wallet-adapter-react';
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
    const message = new TextEncoder().encode(otp);
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
  const [telegramId, setTelegramId] = useState('');
  const [signature] = useAtom(signatureAtom);
  const wallet = useWallet();

  useEffect(() => {
    const fetchTelegramId = async () => {
      if (wallet.publicKey) {
        const tgId = await fetch(
          endpoint + `/users/${wallet.publicKey.toString()}`
        );
        const data = await tgId.json();
        setTelegramId(data.telegramId);
      }
    };

    fetchTelegramId();
  }, [wallet.publicKey]);

  return (
    <div className="flex flex-col gap-6 mt-40 container">
      <h1 className="text-2xl font-bold">Link your wallet</h1>
      {wallet.publicKey && (
        <>
          <div className="text-sm text-muted-foreground">
            <div>Telegram ID:</div>
            <div>{telegramId ? telegramId : 'No telegram ID'}</div>
            <div>public key: {wallet.publicKey.toString()}</div>
          </div>
        </>
      )}
      <h2 className="text-sm text-muted-foreground">
        Generate an OTP to link your wallet, then submit it to verify your
        account.
      </h2>
      <div className="flex justify-center">
        <OtpField />
      </div>
      <div className="flex gap-4">
        <OtpButton />
        <SubmitButton />
      </div>
      <div className="text-sm text-muted-foreground">
        <div>Signature:</div>
        <div>{signature ? signature : 'No signature'}</div>
      </div>
    </div>
  );
}
