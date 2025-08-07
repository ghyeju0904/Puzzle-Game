// @ts-ignore
import React, { useMemo } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';

interface GameResultProps {
  isSuccess: boolean;
  timeLeft: number;
  moves: number;
  level: number;
  score: number; // 실제 점수 추가
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
  score, // 실제 점수
  onNextLevel,
  onRetry,
  onShare,
  web3Connected,
  onSendReward,
}) => {
  const { timeUsed, icon, title, borderColor, titleColor, bonusInfo } = useMemo(() => {
    const timeUsed = 180 - timeLeft; // 3분 기준으로 수정
    const icon = isSuccess ? '🎉' : '😿';
    const title = isSuccess ? '퍼즐 완성!' : score <= 0 ? '점수 소진!' : '시간 초과!';
    const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
    const titleColor = isSuccess ? 'text-green-600' : 'text-red-600';
    
    // 15초 이내 완성 시 보너스 정보
    const isQuickCompletion = isSuccess && timeUsed <= 15;
    const bonusInfo = isQuickCompletion ? {
      show: true,
      message: '⚡ 빠른 완성 보너스!',
      points: '+20점'
    } : null;
    
    return { timeUsed, icon, title, borderColor, titleColor, bonusInfo };
  }, [isSuccess, timeLeft, score]);

  const stats = useMemo(() => [
    { label: '소요 시간:', value: `${timeUsed}초` },
    { label: '이동 횟수:', value: `${moves}회` },
    { label: '레벨:', value: level.toString() },
    { label: '최종 점수:', value: `${score}점`, className: score > 0 ? 'text-green-600' : 'text-red-600' }
  ], [timeUsed, moves, level, score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-6 ${borderColor}`}
      >
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-4xl sm:text-6xl mb-3 sm:mb-4"
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${titleColor}`}>
            {title}
          </h2>

          {/* Bonus Info */}
          {bonusInfo && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mb-3 sm:mb-4 p-2 sm:p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg"
            >
              <div className="text-yellow-800 font-bold text-base sm:text-lg">
                {bonusInfo.message}
              </div>
              <div className="text-yellow-700 text-xs sm:text-sm">
                {bonusInfo.points} 추가!
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">{stat.label}</span>
                <span className={`font-semibold ${stat.className || ''}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2 sm:space-y-3">
            {isSuccess ? (
              <>
                {web3Connected && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSendReward}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    🪙 0.2 Puzzle Points 받기
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onShare}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  📤 Farcaster에 공유하기
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNextLevel}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                >
                  다음 레벨로
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                다시 시도하기
              </motion.button>
            )}
          </div>

          {!web3Connected && isSuccess && (
            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
              💡 보상을 받으려면 MetaMask를 연결하세요!
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameResult; 