'use client';
import React, { useState } from 'react';
import { Wallet, Activity } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined') {
      try {
        // Request account access from MetaMask
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          showToast("MetaMask connected successfully!");
        }
      } catch (error: any) {
        if (error.code === 4001) {
          showToast("Connection rejected by user");
        } else {
          showToast("Failed to connect wallet");
        }
      }
    } else {
      showToast("Please install MetaMask extension!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    showToast("Wallet disconnected");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <div className={styles.logo}>
          <Activity className={styles.logoIcon} size={28} />
          <span>Blockchain.com Instititutional</span>
        </div>
        
        <div className={styles.navLinks}>
          <a href="#" className={`${styles.navLink} ${styles.active}`}>Portfolio</a>
          <a href="#" className={styles.navLink} onClick={(e) => { e.preventDefault(); showToast("Markets feature coming soon in V2"); }}>Markets</a>
          <a href="#" className={styles.navLink} onClick={(e) => { e.preventDefault(); showToast("Trading platform is currently in beta"); }}>Trading</a>
          <a href="#" className={styles.navLink} onClick={(e) => { e.preventDefault(); showToast("Reports dashboard coming soon"); }}>Reports</a>
          
          <button 
            className={`btn ${styles.walletBtn}`}
            onClick={walletAddress ? disconnectWallet : connectWallet}
            style={{ background: walletAddress ? 'var(--success)' : 'var(--primary)' }}
          >
            <Wallet size={16} />
            {walletAddress 
              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
              : 'Connect Wallet'}
          </button>
        </div>
      </div>

      {/* Simple Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 24px',
          borderRadius: '8px',
          color: '#f8fafc',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <Activity size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
