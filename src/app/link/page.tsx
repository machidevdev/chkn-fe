'use client';

//field with an input where user puts an otp and signs it with their wallet
//then it verifies the otp and updates the user's subscription status
import { useAnchorProvider } from '@/components/solana/solana-provider';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

const OtpField = ({
  otp,
  setOtp,
}: {
  otp: string;
  setOtp: (otp: string) => void;
}) => {
  return (
    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
  );
};

export default function Link() {
  const wallet = useWallet();
  const [otp, setOtp] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  const createOtp = async () => {
    //make http request to server to create otp
    const response = await fetch('/api/create-otp', {
      method: 'POST',
      body: JSON.stringify({ wallet: wallet.publicKey?.toBase58() }),
    });
    const data = await response.json();
    setOtp(data.otp);
  };

  const handleSubmit = async () => {
    if (!wallet.publicKey || !wallet.signMessage) {
      alert('Please connect your wallet');
      return;
    }
    const message = new TextEncoder().encode(otp);
    const signature = await wallet.signMessage(message);
    const decodedSignature = bs58.encode(signature);
    setSignature(decodedSignature);
  };

  return (
    <div>
      <OtpField otp={otp} setOtp={setOtp} />
      <button onClick={handleSubmit}>Submit</button>
      <div>{signature ? 'Signature: ' + signature : 'No signature'}</div>
    </div>
  );
}
