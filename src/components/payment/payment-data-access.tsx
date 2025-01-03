'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { useMutation } from '@tanstack/react-query';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import IDL from '../../../anchor/target/idl/chkn.json';
import * as anchor from '@coral-xyz/anchor';
import { useAtom } from 'jotai';
import { receiverWalletAtom } from '@/hooks/useSettings';

export function usePaymentProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const transactionToast = useTransactionToast();
  const program = new Program(IDL as Idl, provider);
  const [receiver] = useAtom(receiverWalletAtom);

  const getOwnerBalance = async () => {
    if (!receiver) return 0;
    try {
      const balance = await connection.getBalance(receiver);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  const processPayment = useMutation({
    mutationKey: ['payment', 'process', { cluster }],
    mutationFn: async (amount: number) => {
      if (!receiver) throw new Error('Receiver wallet not set');
      return program.methods
        .processPayment(new BN(amount * LAMPORTS_PER_SOL))
        .accounts({
          payer: provider.publicKey,
          receiver,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (error) => {
      console.error('Payment error:', error);
    },
  });

  return {
    program,
    processPayment,
    getOwnerBalance,
    receiver,
  };
}
