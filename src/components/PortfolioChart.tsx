'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './PortfolioChart.module.css';

// Helper to generate mock data if API fails (Rate Limit protection)
const generateFallbackData = (daysStr: string) => {
  const days = daysStr === 'max' ? 365 : parseInt(daysStr);
  const points = days === 1 ? 24 : Math.min(days, 90);
  const data = [];
  let baseValue = 50000; // arbitrary base value
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * (days === 1 ? 60 * 60 * 1000 : (days/points) * 24 * 60 * 60 * 1000));
    const change = (Math.random() - 0.45) * (baseValue * 0.05);
    baseValue = baseValue + change;
    
    const dateStr = days === 1
      ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
    data.push({ date: dateStr, value: baseValue });
  }
  return data;
};

// Fetch real chart data from CoinGecko
const fetchChartData = async (coinId: string, days: string) => {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    
    const json = await res.json();
    if (json.prices) {
      return json.prices.map((item: [number, number]) => {
        const time = new Date(item[0]);
        const dateStr = days === '1' 
          ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          date: dateStr,
          value: item[1],
        };
      });
    }
  } catch (error) {
    console.warn('CoinGecko API rate limit reached, using fallback mock data for smooth UX.', error);
    return generateFallbackData(days);
  }
  return generateFallbackData(days);
};

const PortfolioChart = ({ coinId = 'bitcoin', coinName = 'Bitcoin (BTC)' }: { coinId?: string, coinName?: string }) => {
  const [activeFilter, setActiveFilter] = useState('1M');
  const [isMounted, setIsMounted] = useState(false);
  const [mockData, setMockData] = useState<{date: string, value: number}[]>([]);

  const getDaysFromFilter = (filter: string) => {
    switch (filter) {
      case '1D': return '1';
      case '1W': return '7';
      case '1M': return '30';
      case '3M': return '90';
      case '1Y': return '365';
      case 'ALL': return 'max';
      default: return '30';
    }
  };

  useEffect(() => {
    const loadData = () => {
      const days = getDaysFromFilter(activeFilter);
      fetchChartData(coinId, days).then(data => {
        if (data.length > 0) setMockData(data);
        setIsMounted(true);
      });
    };
    
    // Load immediately
    loadData();

    // Auto refresh chart data every 60 seconds
    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, [coinId, activeFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '4px' }}>{label}</p>
          <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`glass-panel ${styles.chartContainer}`}>
      {!isMounted || mockData.length === 0 ? (
        <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading chart data...
        </div>
      ) : (
        <>
      <div className={styles.chartHeader}>
        <div>
          <div className={styles.balanceLabel}>{coinName} Price</div>
          <div className={styles.balanceValue}>{formatCurrency(mockData[mockData.length - 1].value)}</div>
          <div 
            className={styles.balanceChange} 
            style={{ 
              color: (mockData[mockData.length - 1].value - mockData[0].value) >= 0 ? 'var(--success)' : 'var(--danger)', 
              background: (mockData[mockData.length - 1].value - mockData[0].value) >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' 
            }}
          >
            {(mockData[mockData.length - 1].value - mockData[0].value) >= 0 ? '+' : ''}
            {formatCurrency(mockData[mockData.length - 1].value - mockData[0].value)} 
            {' '}
            ({(((mockData[mockData.length - 1].value - mockData[0].value) / mockData[0].value) * 100).toFixed(2)}%)
          </div>
        </div>
        
        <div className={styles.timeFilters}>
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((f) => (
            <button 
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              hide={true} 
              domain={['dataMin - (dataMin * 0.05)', 'dataMax + (dataMax * 0.05)']} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
        </>
      )}
    </div>
  );
};

export default PortfolioChart;
