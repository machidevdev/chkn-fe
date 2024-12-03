'use client';

import { getChknProgram, getChknProgramId } from '@project/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { BN } from '@coral-xyz/anchor';

export function useChknProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getChknProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getChknProgram(provider);

  const accounts = useQuery({
    queryKey: ['chkn', 'all', { cluster }],
    queryFn: () => program.account.chkn.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const processPayment = useMutation({
    mutationKey: ['chkn', 'process-payment', { cluster }],
    mutationFn: (amount: number) =>
      program.methods
        .processPayment(new BN(amount * LAMPORTS_PER_SOL))
        .accounts({
          receiver: programId,
        })
        .signers([])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
  };
}

export function useChknProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useChknProgram();

  const accountQuery = useQuery({
    queryKey: ['chkn', 'fetch', { cluster, account }],
    queryFn: () => program.account.chkn.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['chkn', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ chkn: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['chkn', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ chkn: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['chkn', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ chkn: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['chkn', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ chkn: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
