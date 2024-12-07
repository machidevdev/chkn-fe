'use client';

import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { usePaymentProgram } from './payment-data-access';
import IDL from '../../../anchor/target/idl/chkn.json';
import { Idl, Program, EventParser } from '@coral-xyz/anchor';
import { useAnchorProvider } from '../solana/solana-provider';

const subscriptionTypes = [
  {
    name: 'Individual Monthly',
    amount: 0.1,
    price: '0.1 SOL',
    interval: 'month',
  },
  { name: 'Individual Yearly', amount: 1, price: '1 SOL', interval: 'year' },
  { name: 'Group Monthly', amount: 0.5, price: '0.5 SOL', interval: 'month' },
  { name: 'Group Yearly', amount: 4, price: '4 SOL', interval: 'year' },
];

const SubscribeButton = ({ amount }: { amount: number }) => {
  const { processPayment } = usePaymentProgram();
  const wallet = useWallet();
  return (
    <Button
      onClick={() => processPayment.mutate(amount)}
      disabled={processPayment.isPending || !wallet.publicKey}
    >
      {processPayment.isPending ? 'Processing...' : 'Subscribe'}
    </Button>
  );
};

const PaymentCard: FC<{ type: (typeof subscriptionTypes)[number] }> = ({
  type,
}) => {
  return (
    <Card key={type.name} className="p-6">
      <CardTitle>{type.name}</CardTitle>
      <CardDescription>
        <div className="flex flex-row justify-between items-baseline">
          <p className="text-sm text-muted-foreground">
            <span className="text-3xl text-primary font-bold">
              {type.amount} SOL
            </span>
          </p>
          <div className="text-sm text-muted-foreground">{type.interval}</div>
        </div>
      </CardDescription>
      <SubscribeButton amount={type.amount} />
    </Card>
  );
};

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Subscription Payments</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Contract Balance</h2>
        <p className="text-xl">{ownerBalance.toFixed(2)} SOL</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionTypes.map((type) => (
          <PaymentCard key={type.name} type={type} />
        ))}
      </div>
    </div>
  );
};

export default PaymentFeature;
