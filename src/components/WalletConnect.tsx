// @ts-ignore
import React from 'react';
// @ts-ignore
import { motion } from 'framer-motion';
import { useWeb3 } from '../hooks/useWeb3';

interface WalletConnectProps {}

const WalletConnect: React.FC<WalletConnectProps> = () => {
  const { web3State, connectWallet, disconnectWallet, isMetaMaskInstalled } = useWeb3();

  const handleConnect = async (): Promise<void> => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const shortenAddress = (address: string): string => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isMetaMaskInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        <p className="text-sm font-medium">
          🦊 MetaMask가 설치되지 않았습니다.
          <br />
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-200"
          >
            MetaMask 설치하기
          </a>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-4"
    >
      {web3State.isConnected ? (
        <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-medium">
                연결됨: {web3State.account && shortenAddress(web3State.account)}
              </p>
              {web3State.balance && (
                <p className="text-xs opacity-90">
                  잔액: {parseFloat(web3State.balance).toFixed(4)} ETH
                </p>
              )}
            </div>
            <button
              onClick={handleDisconnect}
              className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
            >
              연결 해제
            </button>
          </div>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={web3State.isConnecting}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg shadow-lg font-medium transition-colors flex items-center space-x-2"
        >
          {web3State.isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>연결 중...</span>
            </>
          ) : (
            <>
              <span>🦊</span>
              <span>MetaMask 연결</span>
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default WalletConnect; 