import { User, Subscription } from '@prisma/client';

export type UserWithSubscription = User & {
  Subscription: Subscription[];
}; 