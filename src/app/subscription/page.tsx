'use client';

import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { jetBrainsMono } from '@/lib/fonts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePaymentProgram } from '@/components/payment/payment-data-access';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { subOptionsAtom, useSettings } from '@/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';

const SubButton = ({ amount }: { amount: number }) => {
  const { publicKey } = useWallet();
  const { processPayment } = usePaymentProgram();
  return (
    <Button
      onClick={() => processPayment.mutate(amount)}
      disabled={processPayment.isPending || !publicKey}
      className="transition-transform active:scale-[0.98] hover:scale-[1.02]"
    >
      {processPayment.isPending ? 'Processing...' : 'Subscribe'}
    </Button>
  );
};

const SubCard = ({
  name,
  price,
  features,
}: {
  name: string;
  price: number;
  features: string[];
}) => {
  return (
    <Card
      className={`${jetBrainsMono.className} border border-primary bg-transparent`}
    >
      <CardContent className="flex flex-row gap-x-4 items-center ">
        <div className="text-[64px]">{price}</div>
        <div className={`flex flex-col gap-y-2 `}>
          <div>SOL</div>
          <div>/month</div>
        </div>
      </CardContent>
      <CardFooter>
        <SubButton amount={price} />
      </CardFooter>
    </Card>
  );
};

const SubCardSkeleton = () => {
  return (
    <Card
      className={`${jetBrainsMono.className} border border-primary bg-transparent`}
    >
      <CardContent className="flex flex-row gap-x-4 items-center">
        <Skeleton className="h-[64px] w-[100px]" />
        <div className="flex flex-col gap-y-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
};

const SubSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
        <SubCardSkeleton />
        <SubCardSkeleton />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
          <SubCardSkeleton />
          <SubCardSkeleton />
        </div>
      </div>
    </div>
  );
};

const SubSection = () => {
  const [subOptions] = useAtom(subOptionsAtom);
  const { isLoading, error } = useSettings();

  if (isLoading) return <SubSectionSkeleton />;
  if (error) return <div>Error loading settings: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Single</h2>
        <div className="text-muted-foreground">Ideal for personal use</div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
        {subOptions.single.map((sub) => (
          <SubCard key={sub.name} {...sub} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Group</h2>
        <div className="text-muted-foreground">Ideal for group use</div>
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
          {subOptions.group.map((sub) => (
            <SubCard key={sub.name} {...sub} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col px-4 pb-10">
      <div className="flex flex-col py-6 my-1 gap-y-1 w-full border-b border-border">
        <h1 className="text-3xl font-semibold">Subscription</h1>
        <p className={`text-muted-foreground ${jetBrainsMono.className}`}>
          View and make changes to your plan.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <SubSection />
      </div>
    </div>
  );
}
