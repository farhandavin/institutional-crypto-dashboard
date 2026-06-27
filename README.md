# 📈 Institutional Crypto Dashboard

An enterprise-grade, real-time cryptocurrency portfolio dashboard designed for institutional investors. Built with modern web technologies, this project focuses on high-performance data visualization, seamless user experience, and robust API management.

## ✨ Key Features
- **Real-Time Market Data:** Integration with the CoinGecko REST API to fetch live cryptocurrency prices and market caps.
- **Interactive Time-Travel Charts:** Dynamic data visualization using Recharts, allowing users to filter historical data across multiple timeframes (1D, 1W, 1M, 3M, 1Y, ALL).
- **Graceful API Degradation:** Built-in rate limit protection (Fallback Mock Data Generator) ensures the application never crashes and the UX remains buttery-smooth even when public API limits are exceeded.
- **Glassmorphism UI:** Modern, institutional-grade dark mode aesthetic built from scratch using CSS Modules.
- **Micro-interactions:** Elegant Toast notifications and intuitive feedback loops for "coming soon" features to simulate a complete product ecosystem.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Vanilla CSS + CSS Modules
- **Data Visualization:** Recharts
- **Icons:** Lucide React

## 🚀 Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
