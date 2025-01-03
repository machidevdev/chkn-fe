'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';
import { ExplorerLink } from '../cluster/cluster-ui';
import Navbar from '../Navbar';
import { useToast } from '@/hooks/use-toast';
export function UiLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col mx-auto w-full">
      <Navbar />

      <div className="min-h-screen  bg-tile">
        <div className="flex-grow lg:mx-auto">
          <Suspense
            fallback={
              <div className="text-center my-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function useTransactionToast() {
  console.log('useTransactionToast');
  const { toast } = useToast();
  return (signature: string) => {
    toast({
      title: 'Transaction sent',
      action: (
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      ),
    });
  };
}
