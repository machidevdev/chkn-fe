'use client';

import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

type subscription = {
  type: string;
  id: number;
  address: string;
  createdAt: Date;
  txHash: string;
  expiresAt: Date;
};

const formatDate = (date?: Date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getSubscriptionLabel = (type?: string) => {
  switch (type) {
    case 'individual':
      return 'Individual';
    case 'group':
      return 'Individual Yearly';

    default:
      return 'No active subscription';
  }
};

const SubscriptionCard = ({ subscription }: { subscription: subscription }) => {
  const isActive = new Date(subscription.expiresAt) > new Date();

  return (
    <Card className="p-4 mb-4">
      <CardTitle className="text-lg mb-4">Current Subscription</CardTitle>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className={isActive ? 'text-green-500' : 'text-red-500'}>
            {isActive ? 'Active' : 'Expired'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type:</span>
          <span>{getSubscriptionLabel(subscription.type)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Created:</span>
          <span>{formatDate(new Date(subscription.createdAt))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Expires:</span>
          <span>{formatDate(new Date(subscription.expiresAt))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction:</span>
          <a
            href={`https://solscan.io/tx/${subscription.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm truncate max-w-[200px]"
          >
            {subscription.txHash}
          </a>
        </div>
      </div>
    </Card>
  );
};

const SubscriptionTable = ({
  subscriptions,
}: {
  subscriptions: subscription[];
}) => {
  return (
    <div className="">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Created</th>
            <th className="text-left p-2">Expires</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Tx</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => {
            const isActive = new Date(sub.expiresAt) > new Date();
            return (
              <tr key={sub.id} className="border-b">
                <td className="p-2">{getSubscriptionLabel(sub.type)}</td>
                <td className="p-2">{formatDate(new Date(sub.createdAt))}</td>
                <td className="p-2">{formatDate(new Date(sub.expiresAt))}</td>
                <td className="p-2">
                  <span
                    className={isActive ? 'text-green-500' : 'text-red-500'}
                  >
                    {isActive ? 'Active' : 'Expired'}
                  </span>
                </td>
                <td className="p-2">
                  <a
                    href={`https://solscan.io/tx/${sub.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const SubscriptionStatus = () => {
  const wallet = useWallet();
  const [subscriptions, setSubscriptions] = useState<subscription[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (wallet.publicKey) {
        const data = await fetch(
          'https://chkn-indexer-production.up.railway.app/subscription/' +
            wallet.publicKey.toString()
        );
        const json = await data.json();
        setSubscriptions(json);
      }
    };

    fetchSubscriptions();
  }, [wallet.publicKey]);

  if (!wallet.publicKey) {
    return (
      <Card className="p-6">
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          Please connect your wallet to view subscription details
        </CardDescription>
      </Card>
    );
  }

  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const mostRecent = sortedSubscriptions[0];
  const history = sortedSubscriptions.slice(1);

  return (
    <div className="space-y-4 min-h-screen">
      <Card className="p-6">
        <CardTitle>Wallet Status</CardTitle>
        <CardDescription>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-sm truncate max-w-[200px]">
                {wallet.publicKey?.toString()}
              </span>
            </div>
          </div>
        </CardDescription>
      </Card>

      {mostRecent && <SubscriptionCard subscription={mostRecent} />}

      {history.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Subscription History</h2>
          <Card className="p-4">
            <SubscriptionTable subscriptions={history} />
          </Card>
        </div>
      )}

      {!mostRecent && (
        <Card className="p-4">
          <CardDescription>No subscription history found</CardDescription>
        </Card>
      )}
    </div>
  );
};
