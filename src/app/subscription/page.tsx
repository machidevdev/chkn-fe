import { SubscriptionStatus } from '@/components/subscription/subscription-status';

export default function Page() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Subscription Details</h1>
      <div className="max-w-xl mx-auto">
        <SubscriptionStatus />
      </div>
    </div>
  );
}
