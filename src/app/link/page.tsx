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
import { useAtom, atom } from 'jotai';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
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
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};

const SubmitButton = () => {
  const { toast } = useToast();
  const [isDisabled, setIsDisabled] = useState(true);
  const wallet = useWallet();
  const [otp] = useAtom(otpAtom);
  const [, setSignature] = useAtom(signatureAtom);

  useEffect(() => {
    setIsDisabled(!otp || otp.length < 6);
  }, [otp]);

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

      const response = await fetch('http://localhost:3000/api/link', {
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
      const { data } = await response.json();
      console.log(data);
      if (data.success) {
        toast({
          title: 'Wallet linked successfully',
          description: 'Your wallet has been linked to your Telegram account',
        });
      } else {
        toast({
          title: 'Failed to link wallet',
          description: 'Please try again',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to link wallet',
        description: 'Please try again',
      });
    }
  };

  return (
    <Button
      disabled={isDisabled}
      variant="outline"
      className={` max-w-80 uppercase text-primary ${jetBrainsMono.className}`}
      onClick={() => handleSubmit()}
    >
      Submit
    </Button>
  );
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
    <div className="max-w-7xl w-full mx-auto pt-6 flex flex-col gap-y-4 px-4">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-semibold">Link</h1>
        <div
          className={`pt-1 ${jetBrainsMono.className} text-muted-foreground`}
        >
          Link your Telegram account
        </div>
      </div>
      <div className={`${jetBrainsMono.className} text-muted-foreground`}>
        Insert the 6 digit code you have received in the Telegram chat and then
        sign the transaction using your wallet.
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
              <SubmitButton />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
