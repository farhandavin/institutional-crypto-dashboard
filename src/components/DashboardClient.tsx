'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioChart from './PortfolioChart';
import CryptoTable, { CoinData } from './CryptoTable';

export default function DashboardClient({ coins }: { coins: CoinData[] }) {
  const router = useRouter();
  
  // Set default selected coin to the first coin in the list (usually Bitcoin)
  const [selectedCoinId, setSelectedCoinId] = useState(coins[0]?.id || 'bitcoin');
  const [selectedCoinName, setSelectedCoinName] = useState(coins[0] ? `${coins[0].name} (${coins[0].symbol.toUpperCase()})` : 'Bitcoin (BTC)');

  // Auto-refresh the server-side fetched table data every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <PortfolioChart key="portfolio-chart-remount" coinId={selectedCoinId} coinName={selectedCoinName} />
      
      <CryptoTable 
        coins={coins} 
        selectedCoinId={selectedCoinId}
        onCoinSelect={(id, name, symbol) => {
          setSelectedCoinId(id);
          setSelectedCoinName(`${name} (${symbol.toUpperCase()})`);
        }} 
      />
    </>
  );
}
