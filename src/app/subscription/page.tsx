'use client';

import { SubscriptionStatus } from '@/components/subscription/subscription-status';
import { jetBrainsMono } from '@/lib/fonts';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePaymentProgram } from '@/components/payment/payment-data-access';
const subOptions = {
  single: [
    {
      name: 'Monthly',
      price: 1,
      features: ['1000 messages', '1000 images'],
    },
    {
      name: 'Yearly',
      price: 10,
      features: ['1000 messages', '1000 images'],
    },
  ],
  group: [
    {
      name: 'Monthly',
      price: 10,
      features: ['1000 messages', '1000 images'],
    },
    {
      name: 'Yearly',
      price: 10,
      features: ['1000 messages', '1000 images'],
    },
  ],
};

const SubButton = ({ amount }: { amount: number }) => {
  const { publicKey } = useWallet();
  const { processPayment } = usePaymentProgram();
  return (
    <Button
      onClick={() => processPayment.mutate(amount)}
      disabled={processPayment.isPending || !publicKey}
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
      className={`${jetBrainsMono.className} border border-primary bg-transparent hover:bg-primary hover:text-accent-foreground transition-colors`}
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

const SubSection = () => {
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
    <div className="max-w-7xl w-full mx-auto flex flex-col">
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
