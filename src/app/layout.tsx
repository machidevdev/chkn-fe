import type { Metadata } from 'next';
import { inter } from '@/lib/fonts';
import './globals.css';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';
import { ReactQueryProvider } from './react-query-provider';
import { UiLayout } from '@/components/ui/ui-layout';
export const metadata: Metadata = {
  title: 'CHKN',
  description: 'CHKN',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} dark`}>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
