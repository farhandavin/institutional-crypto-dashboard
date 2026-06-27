import DashboardClient from '@/components/DashboardClient';
import { CoinData } from '@/components/CryptoTable';

// Fetch live data from CoinGecko API
async function getTopCoins(): Promise<CoinData[]> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return res.json();
  } catch (error) {
    console.error(error);
    // Return fallback data if API fails (e.g. rate limit)
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 65000,
        price_change_percentage_24h: 2.5,
        market_cap: 1200000000000,
        total_volume: 35000000000,
      }
    ];
  }
}

export default async function Home() {
  const coins = await getTopCoins();

  return (
    <div className="container" style={{ paddingBottom: '64px' }}>
      <header style={{ marginTop: '48px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Institutional Overview
        </h1>
        <p style={{ color: '#9ca3af' }}>
          Monitor your digital assets across multiple networks with real-time institutional-grade pricing.
        </p>
      </header>

      <DashboardClient coins={coins} />
    </div>
  );
}
