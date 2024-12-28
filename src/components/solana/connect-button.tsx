import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { WalletButton } from './solana-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jetBrainsMono } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export function ConnectButton() {
  const { publicKey, disconnect, wallet } = useWallet();

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
    }
  }, [publicKey]);

  if (!publicKey) {
    return <WalletButton />;
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'font-bold data-[state=open]:border-b-0 data-[state=open]:rounded-b-none'
            )}
          >
            {publicKey.toBase58().slice(0, 4)}...
            {publicKey.toBase58().slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`${jetBrainsMono.className} w-[var(--radix-dropdown-menu-trigger-width)] border border-primary border-t-0 bg-[#151722] p-0 rounded-t-none`}
        >
          <DropdownMenuItem onClick={disconnect} className="py-2">
            Disconnect
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAddress} className="py-2">
            Copy Address
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
