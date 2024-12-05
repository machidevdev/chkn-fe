import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Create the root router
export const appRouter = router({
  createOtp: publicProcedure
    .input(z.object({ wallet: z.string().optional() }))
    .mutation(async ({ input }) => {
      // Your OTP generation logic here
      const otp = Math.random().toString(36).slice(2, 8);
      return { otp };
    }),
  
  verifyOtp: publicProcedure
    .input(z.object({ 
      otp: z.string(),
      wallet: z.string(),
      signature: z.instanceof(Uint8Array)
    }))
    .mutation(async ({ input }) => {
      // Your OTP verification logic here
      return { success: true };
    }),
});

export type AppRouter = typeof appRouter; 