// @ts-ignore
import React, { useMemo } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';
import { calculateScore } from '../utils/puzzleUtils';

interface GameResultProps {
  isSuccess: boolean;
  timeLeft: number;
  moves: number;
  level: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onShare: () => void;
  web3Connected: boolean;
  onSendReward: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  isSuccess,
  timeLeft,
  moves,
  level,
  onNextLevel,
  onRetry,
  onShare,
  web3Connected,
  onSendReward,
}) => {
  const { score, timeUsed, icon, title, borderColor, titleColor } = useMemo(() => {
    const score = calculateScore(timeLeft, moves, level);
    const timeUsed = 60 - timeLeft;
    const icon = isSuccess ? '🎉' : '😿';
    const title = isSuccess ? '퍼즐 완성!' : '시간 초과!';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const titleColor = isSuccess ? 'text-green-600' : 'text-red-600';
    return { score, timeUsed, icon, title, borderColor, titleColor };
  }, [isSuccess, timeLeft, moves, level]);

  const stats = useMemo(() => [
    { label: '소요 시간:', value: `${timeUsed}초` },
    { label: '이동 횟수:', value: `${moves}회` },
    { label: '레벨:', value: level.toString() },
    ...(isSuccess ? [{ label: '점수:', value: `${score}점`, className: 'text-green-600' }] : [])
  ], [timeUsed, moves, level, score, isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 ${borderColor}`}
      >
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h2 className={`text-2xl font-bold mb-2 ${titleColor}`}>
            {title}
          </h2>

          {/* Stats */}
          <div className="space-y-2 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{stat.label}</span>
                <span className={`font-semibold ${stat.className || ''}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isSuccess ? (
              <>
                {web3Connected && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSendReward}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    🪙 0.2 Puzzle Points 받기
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShare}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  📤 Farcaster에 공유하기
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNextLevel}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  다음 레벨로
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                다시 시도하기
              </motion.button>
            )}
          </div>

          {!web3Connected && isSuccess && (
            <p className="text-sm text-gray-500 mt-4">
              💡 보상을 받으려면 MetaMask를 연결하세요!
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameResult; 