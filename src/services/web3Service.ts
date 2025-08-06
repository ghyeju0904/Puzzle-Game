// @ts-ignore
import { ethers } from 'ethers';
import { Web3State } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async connectWallet(): Promise<Web3State> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      const account = await this.signer.getAddress();
      const balance = await this.provider.getBalance(account);

      return {
        isConnected: true,
        account,
        balance: ethers.formatEther(balance),
        isConnecting: false,
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return {
        isConnected: false,
        account: null,
        balance: null,
        isConnecting: false,
      };
    }
  }

  async disconnectWallet(): Promise<Web3State> {
    this.provider = null;
    this.signer = null;
    
    return {
      isConnected: false,
      account: null,
      balance: null,
      isConnecting: false,
    };
  }

  async sendReward(amount: string): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // This is a mock transaction for demo purposes
      // In a real implementation, you would interact with a smart contract
      const mockTransaction = {
        to: await this.signer.getAddress(),
        value: ethers.parseEther(amount),
      };

      const tx = await this.signer.sendTransaction(mockTransaction);
      await tx.wait();

      return true;
    } catch (error) {
      console.error('Failed to send reward:', error);
      return false;
    }
  }

  async getAccountInfo(): Promise<{ account: string; balance: string } | null> {
    try {
      if (!this.signer) return null;

      const account = await this.signer.getAddress();
      const balance = await this.provider!.getBalance(account);

      return {
        account,
        balance: ethers.formatEther(balance),
      };
    } catch (error) {
      console.error('Failed to get account info:', error);
      return null;
    }
  }

  isMetaMaskInstalled(): boolean {
    return typeof window.ethereum !== 'undefined';
  }

  async switchNetwork(chainId: string): Promise<boolean> {
    try {
      if (!window.ethereum) return false;

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  }
}

export const web3Service = new Web3Service(); 