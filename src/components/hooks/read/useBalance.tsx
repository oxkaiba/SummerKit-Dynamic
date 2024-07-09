"use client";

import { useAccount, useBalance } from 'wagmi';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CircleAlert, Loader2, Wallet } from "lucide-react";
import Eth from "@/public/eth.svg";

export default function OnchainBalance() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });

  if (isConnecting) return <div className="text-xxs font-semibold flex justify-center items-center">
    Connecting… <Loader2 className="ml-2 h-4 w-4 animate-spin text-base-500" />
  </div>;
  if (isDisconnected) return <div className="px-4 text-xs font-semibold flex justify-center items-center">
    No&nbsp;account&nbsp;connected <span className='bg-gradient-to-tr from-zinc-500/50 to-blue-500 rounded-full p-1 ml-1'><Wallet size={13} className='text-foreground' /></span>
  </div>;
  if (isLoading) return <div className="text-xxs font-semibold flex justify-center items-center">
    Fetching balance… <Loader2 className="ml-2 h-4 w-4 animate-spin text-base-500" /></div>;
  if (isError) return <div className="text-xxs font-semibold flex justify-center items-center">
    Error fetching balance <CircleAlert size={20} className='ml-2 text-base-500' />
  </div>;

  let formattedBalance = "0";
  if (data) {
    const balance = Number(data.formatted);
    formattedBalance = balance < 0.0001 ? "0" : balance.toFixed(4);
  }

  return (
    <div className="text-xs font-semibold flex justify-center items-center px-2 mt-0.25">
      {formattedBalance}&nbsp;{data?.symbol} <Avatar className='w-4 h-4 ml-1 hidden md:flex'>
        <AvatarImage src={Eth.src} />
      </Avatar>
    </div>
  );
}
