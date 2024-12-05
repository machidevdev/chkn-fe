'use client';

import { trpc } from '@/utils/trpc';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export default function Link() {
  const wallet = useWallet();
  const [otp, setOtp] = useState('');
  const [signature, setSignature] = useState<Uint8Array | null>(null);

  const createOtpMutation = trpc.createOtp.useMutation();
  const verifyOtpMutation = trpc.verifyOtp.useMutation();

  const createOtp = async () => {
    const result = await createOtpMutation.mutateAsync({
      wallet: wallet.publicKey?.toBase58(),
    });
    setOtp(result.otp);
  };

  const handleSubmit = async () => {
    if (!wallet.publicKey || !wallet.signMessage) {
      alert('Please connect your wallet');
      return;
    }
    const message = new TextEncoder().encode(otp);
    const signature = await wallet.signMessage(message);
    setSignature(signature);

    await verifyOtpMutation.mutateAsync({
      otp,
      wallet: wallet.publicKey.toBase58(),
      signature,
    });
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      <div>{signature ? 'Signature: ' + signature : 'No signature'}</div>
    </div>
  );
}
