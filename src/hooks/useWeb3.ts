// @ts-ignore
import { useState, useEffect, useCallback } from 'react';
import { Web3State } from '../types';
import { web3Service } from '../services/web3Service';

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    account: null,
    balance: null,
    isConnecting: false,
  });

  const connectWallet = async () => {
    setWeb3State(prev => ({ ...prev, isConnecting: true }));
    
    try {
      const newState = await web3Service.connectWallet();
      setWeb3State(newState);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWeb3State(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = async () => {
    const newState = await web3Service.disconnectWallet();
    setWeb3State(newState);
  };

  const sendReward = async (amount: string) => {
    if (!web3State.isConnected) {
      throw new Error('Wallet not connected');
    }

    return await web3Service.sendReward(amount);
  };

  const refreshAccountInfo = useCallback(async () => {
    if (web3State.isConnected) {
      const accountInfo = await web3Service.getAccountInfo();
      if (accountInfo) {
        setWeb3State(prev => ({
          ...prev,
          account: accountInfo.account,
          balance: accountInfo.balance,
        }));
      }
    }
  }, [web3State.isConnected]);

  useEffect(() => {
    // Check if MetaMask is installed
    if (web3Service.isMetaMaskInstalled()) {
      // Listen for account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            refreshAccountInfo();
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }
    }
  }, [refreshAccountInfo]);

  return {
    web3State,
    connectWallet,
    disconnectWallet,
    sendReward,
    refreshAccountInfo,
    isMetaMaskInstalled: web3Service.isMetaMaskInstalled(),
  };
}; 