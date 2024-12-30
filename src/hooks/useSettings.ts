import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { useQuery } from '@tanstack/react-query';
import { useAnchorProvider } from '../components/solana/solana-provider';
import IDL from '../../anchor/target/idl/chkn.json';
import { atom, useAtom } from 'jotai';

type SettingsAccount = {
    owner: PublicKey;
    priceIndividualMonthly: BN;
    priceIndividualYearly: BN;
    priceGroupMonthly: BN;
    priceGroupYearly: BN;
};

type SubOption = {
    name: string;
    price: number;
    features: string[];
};

type SubOptions = {
    single: SubOption[];
    group: SubOption[];
};

const defaultOptions: SubOptions = {
    single: [
        {
            name: 'Monthly',
            price: 0,
            features: ['1000 messages', '1000 images'],
        },
        {
            name: 'Yearly',
            price: 0,
            features: ['1000 messages', '1000 images'],
        },
    ],
    group: [
        {
            name: 'Monthly',
            price: 0,
            features: ['1000 messages', '1000 images'],
        },
        {
            name: 'Yearly',
            price: 0,
            features: ['1000 messages', '1000 images'],
        },
    ],
};

export const subOptionsAtom = atom<SubOptions>(defaultOptions);
export const receiverWalletAtom = atom<PublicKey | null>(null);

export function useSettings() {
    const { connection } = useConnection();
    const provider = useAnchorProvider();
    const [, setSubOptions] = useAtom(subOptionsAtom);
    const [, setReceiverWallet] = useAtom(receiverWalletAtom);

    const program = new Program(IDL as Idl, provider) as Program<Idl> & {
        account: {
            settings: {
                fetch(address: PublicKey): Promise<SettingsAccount>;
            };
        };
    };

    const settingsQuery = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const [settingsAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from("settings")],
                program.programId
            );

            const settings = await program.account.settings.fetch(settingsAccount);
            const prices = {
                priceIndividualMonthly: settings.priceIndividualMonthly.toNumber() / 1e9,
                priceIndividualYearly: settings.priceIndividualYearly.toNumber() / 1e9,
                priceGroupMonthly: settings.priceGroupMonthly.toNumber() / 1e9,
                priceGroupYearly: settings.priceGroupYearly.toNumber() / 1e9,
                receiver: settings.owner,
            };
  

            setReceiverWallet(prices.receiver);
            setSubOptions({
                single: [
                    {
                        name: 'Monthly',
                        price: prices.priceIndividualMonthly,
                        features: ['1000 messages', '1000 images'],
                    },
                    {
                        name: 'Yearly',
                        price: prices.priceIndividualYearly,
                        features: ['1000 messages', '1000 images'],
                    },
                ],
                group: [
                    {
                        name: 'Monthly',
                        price: prices.priceGroupMonthly,
                        features: ['1000 messages', '1000 images'],
                    },
                    {
                        name: 'Yearly',
                        price: prices.priceGroupYearly,
                        features: ['1000 messages', '1000 images'],
                    },
                ],
            });

            return prices;
        },
        enabled: !!connection && !!provider,
    });

    return {
        settings: settingsQuery.data,
        isLoading: settingsQuery.isLoading,
        error: settingsQuery.error,
    };
}
