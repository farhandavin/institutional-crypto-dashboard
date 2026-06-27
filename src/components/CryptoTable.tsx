'use client';
import React from 'react';
import styles from './CryptoTable.module.css';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CryptoTableProps {
  coins: CoinData[];
  selectedCoinId?: string;
  onCoinSelect?: (id: string, name: string, symbol: string) => void;
}

const CryptoTable: React.FC<CryptoTableProps> = ({ coins, selectedCoinId, onCoinSelect }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatCompact = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2>Market Overview</h2>
      </div>
      
      <div className="glass-panel" style={{ padding: '0' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>24h Volume</th>
              <th>Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr 
                key={coin.id} 
                onClick={() => onCoinSelect && onCoinSelect(coin.id, coin.name, coin.symbol)}
                style={{ 
                  cursor: onCoinSelect ? 'pointer' : 'default',
                  background: selectedCoinId === coin.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                }}
              >
                <td>
                  <div className={styles.coinInfo}>
                    <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                    <div>
                      <div className={styles.coinName}>{coin.name}</div>
                      <div className={styles.coinSymbol}>{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{formatCurrency(coin.current_price)}</td>
                <td className={coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}>
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td>{formatCompact(coin.total_volume)}</td>
                <td>{formatCompact(coin.market_cap)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;
