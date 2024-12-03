'use client';

import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePaymentProgram } from './payment-data-access';
import IDL from '../../../anchor/target/idl/chkn.json';
import { Idl, Program, EventParser } from '@coral-xyz/anchor';
import { useAnchorProvider } from '../solana/solana-provider';

const subscriptionTypes = [
  { name: 'Individual Monthly', amount: 1, price: '1 SOL' },
  { name: 'Individual Yearly', amount: 10, price: '10 SOL' },
  { name: 'Group Monthly', amount: 5, price: '5 SOL' },
  { name: 'Group Yearly', amount: 40, price: '40 SOL' },
];

export const PaymentFeature: FC = () => {
  const wallet = useWallet();
  const { processPayment, getOwnerBalance } = usePaymentProgram();
  const { connection } = useConnection();
  const provider = useAnchorProvider();
  const [ownerBalance, setOwnerBalance] = useState<number>(0);

  useEffect(() => {
    // Fetch initial balance
    const fetchBalance = async () => {
      const balance = await getOwnerBalance();
      setOwnerBalance(balance);
    };
    fetchBalance();

    // Set up interval to refresh balance
    const intervalId = setInterval(fetchBalance, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId);
  }, [getOwnerBalance]);

  useEffect(() => {
    // add a listener to the tx and log the events
    const program = new Program(IDL as Idl, provider);
    const listener = connection.onLogs(program.programId, (logInfo) => {
      const parser = new EventParser(program.programId, program.coder);
      const events = parser.parseLogs(logInfo.logs);
      for (const event of Array.from(events)) {
        console.log(event);
      }
    });
    return () => {
      connection.removeOnLogsListener(listener);
    };
  }, [connection, provider]);

  const handlePayment = async (amount: number) => {
    if (!wallet.publicKey) {
      alert('Please connect your wallet');
      return;
    }
    processPayment.mutate(amount);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Subscription Payments</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Contract Balance</h2>
        <p className="text-xl">{ownerBalance.toFixed(2)} SOL</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionTypes.map((type) => (
          <Card key={type.name} className="p-6">
            <h2 className="text-xl font-semibold mb-2">{type.name}</h2>
            <p className="text-2xl font-bold mb-4">{type.price}</p>
            <Button
              onClick={() => handlePayment(type.amount)}
              disabled={processPayment.isPending || !wallet.publicKey}
              className="w-full"
            >
              {processPayment.isPending ? 'Processing...' : 'Subscribe'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentFeature;
