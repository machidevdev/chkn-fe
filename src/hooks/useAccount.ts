import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";



export const useAccount = (publicKey: PublicKey | null) => {  

return  useQuery({
  queryKey: ['user', publicKey?.toBase58()],
  enabled: !!publicKey,
  queryFn: async () => {
      const res = await fetch(`/api/user?address=${publicKey?.toBase58()}`);
      return res.json();
    },
  });
};


