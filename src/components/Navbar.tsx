import Image from 'next/image';
import { chakraPetch, inter, jetBrainsMono } from '@/lib/fonts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AccountIcon } from './icons/AccountIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { LinkIcon } from './icons/LinkIcon';
import { ConnectButton } from './solana/connect-button';

const navItems = [
  { label: 'Account', path: '/account', icon: AccountIcon },
  { label: 'Subscription', path: '/subscription', icon: RefreshIcon },
  { label: 'Link', path: '/link', icon: LinkIcon },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bg-navbar-bg flex flex-col">
      <div className="flex w-full justify-between max-w-7xl mx-auto py-4 px-2">
        <div className="flex items-center gap-x-8">
          <div className="flex items-center gap-x-4">
            <Image src={'/chkn.png'} alt="logo" width={48} height={40} />
            <div className={`font-bold ${chakraPetch.className}`}>CHKN</div>
          </div>
        </div>

        <div className={`flex gap-x-4 items-center ${jetBrainsMono.className}`}>
          <div className="font-bold">Docs</div>
          <ConnectButton />
        </div>
      </div>
      <div className={`max-w-7xl mx-auto w-full flex gap-x-4`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'flex flex-row gap-x-2 py-2.5 px-3 border-b-2 group',
              inter.className,
              pathname === item.path
                ? 'border-primary text-primary'
                : 'border-transparent hover:text-primary text-white'
            )}
          >
            <item.icon className="w-5 h-5" />
            <div className="text-sm font-normal">{item.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
