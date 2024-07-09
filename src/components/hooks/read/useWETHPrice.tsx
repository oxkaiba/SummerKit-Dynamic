"use client"

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Eth from "@/public/eth.svg";

interface DexScreenerResponse {
  pairs: {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
    quoteToken: {
      address: string;
      name: string;
      symbol: string;
    };
    priceNative: string;
    priceUsd: string;
    liquidity: {
      usd: number;
      base: number;
      quote: number;
    };
    volume: {
      h24: number;
      h24Change: number;
    };
    fees: {
      h24: number;
    };
    txns: {
      h24: {
        buys: number;
        sells: number;
      };
      h24Change: {
        buys: number;
        sells: number;
      };
    };
    createdAt: string;
  }[];
}

const fetchWethPrice = async (): Promise<number | null> => {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=/WETH%20USDC');
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data: DexScreenerResponse = await response.json();
    const wethPair = data.pairs.find(pair => pair.baseToken.symbol === 'WETH' && pair.quoteToken.symbol === 'USDC');
    if (wethPair) {
      return parseFloat(wethPair.priceUsd);
    } else {
      console.error('WETH-USDC pair not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching WETH price:', error);
    return null;
  }
};

const WETHPrice: React.FC = () => {
  const [wethPrice, setWethPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getWethPrice = async () => {
      const price = await fetchWethPrice();
      setWethPrice(price);
      setLoading(false);
    };

    getWethPrice();
  }, []);

  if (loading) {
    return <div className='flex items-center border border-zinc-800/50 p-2 px-2.5 text-foreground
    font-semibold text-xs rounded-full'>
      Loading...
      <Loader2 size={16} className="ml-2 animate-spin text-base-500" />
    </div>;
  }

  if (wethPrice === null) {
    return null;
  }

  return (
    <div className='flex items-center border border-zinc-800/50 p-2 px-2.5 text-foreground
   font-semibold text-xs rounded-full'>
      <span>${wethPrice}</span>
      <Avatar className='w-4 h-4 ml-1.5'>
        <AvatarImage src={Eth.src} />
      </Avatar>
    </div>
  );
};

export default WETHPrice;