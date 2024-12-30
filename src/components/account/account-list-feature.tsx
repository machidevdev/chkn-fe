'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { jetBrainsMono } from '@/lib/fonts';
import { useQuery } from '@tanstack/react-query';
import { UserWithSubscription } from '@/lib/types';
import { useAccount } from '@/hooks/useAccount';
import { Subscription, User } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

const AccountHeader = () => {
  return (
    <div className="py-6 flex flex-col gap-1 border-b border-border">
      <h1 className="text-[30px] font-semibold">Account</h1>
      <p className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}>
        Manage your accounts and balances
      </p>
    </div>
  );
};

const Wallet = () => {
  const { publicKey } = useWallet();
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <p className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}>
        {publicKey ? (
          publicKey.toBase58().slice(0, 4) +
          '...' +
          publicKey.toBase58().slice(-4)
        ) : (
          <WalletButton />
        )}
      </p>
    </div>
  );
};

const WalletSkeleton = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <Skeleton className="h-6 w-32" />
    </div>
  );
};

const TelegramSkeleton = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Telegram</h1>
      <Skeleton className="h-6 w-48" />
    </div>
  );
};

const Telegram = ({ user }: { user?: UserWithSubscription }) => {
  const { publicKey } = useWallet();
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', publicKey?.toBase58()],
    enabled: !!publicKey,
    queryFn: async () => {
      const res = await fetch(`/api/user?address=${publicKey?.toBase58()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }
      return res.json();
    },
  });

  if (!publicKey) return null;
  if (isLoading) return <TelegramSkeleton />;

  if (isLoading)
    return (
      <p className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}>
        Loading...
      </p>
    );
  if (error)
    return (
      <p className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}>
        No telegram account linked
      </p>
    );

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Telegram</h1>
      <p className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}>
        {data?.user?.telegramId || 'No telegram account linked'}
      </p>
    </div>
  );
};

const SubscriptionListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Your subscription</h1>
      <div className="flex flex-row">
        <div className="flex flex-col gap-y-2 pr-3">
          <p className="text-white">Type</p>
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-col gap-y-2 border-l border-border px-3">
          <p className="text-white">Status</p>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-col gap-y-2 border-l border-border px-3">
          <p className="text-white">Next payment</p>
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    </div>
  );
};

const SubscriptionList = ({
  user,
  isLoading,
}: {
  user?: User & { subscriptions: Subscription[] };
  isLoading?: boolean;
}) => {
  if (isLoading) return <SubscriptionListSkeleton />;

  if (!user)
    return (
      <div className="text-2xl">
        Your subscription
        <div className="flex flex-row gap-2">
          <div className="text-sm text-muted-foreground">
            No subscription active
          </div>
        </div>
      </div>
    );

  const subscription = user.subscriptions?.[0];
  const isActive =
    subscription?.expiresAt && new Date(subscription.expiresAt) > new Date();
  const nextPayment = subscription?.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString()
    : 'N/A';

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Your subscription</h1>
      <div className="flex flex-row">
        <div className="flex flex-col gap-y-2 pr-3">
          <p className="text-white">Type</p>
          <p
            className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}
          >
            {subscription?.type}
          </p>
        </div>
        <div className="flex flex-col gap-y-2 border-l border-border px-3">
          <p className="text-white">Status</p>
          <p
            className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="flex flex-col gap-y-2 border-l border-border px-3">
          <p className="text-white">Next payment</p>
          <p
            className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}
          >
            {nextPayment}
          </p>
        </div>
      </div>
      {!subscription && (
        <div
          className={`text-primary uppercase text-lg cursor-pointer ${jetBrainsMono.className}`}
        >
          UPGRADE PLAN
        </div>
      )}
    </div>
  );
};

const CreditsSkeleton = () => {
  return <Skeleton className="h-6 w-28" />;
};

const Credits = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Credits used</h1>
      <div className="flex flex-row">
        <p
          className={`text-sm text-muted-foreground ${jetBrainsMono.className}`}
        >
          {user?.creditsUsed || 0} / {user?.credits || 0}
        </p>
      </div>
    </div>
  );
};

export default function AccountListFeature() {
  const { publicKey } = useWallet();
  const { data, isLoading } = useAccount(publicKey);

  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col gap-4 px-4">
      <AccountHeader />
      <div className="flex flex-col w-full gap-12">
        {isLoading ? <WalletSkeleton /> : <Wallet />}
        <Telegram user={data?.user} />
        <SubscriptionList user={data?.user} isLoading={isLoading} />
        {isLoading ? <CreditsSkeleton /> : <Credits user={data?.user} />}
      </div>
    </div>
  );
}
