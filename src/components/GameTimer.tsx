// @ts-ignore
import React, { useMemo } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';
import { formatTime } from '../utils/puzzleUtils';

interface GameTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

const GameTimer: React.FC<GameTimerProps> = ({ timeLeft, totalTime, isActive }) => {
  const { progress, isWarning, isCritical } = useMemo(() => {
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const isWarning = timeLeft <= 10;
    const isCritical = timeLeft <= 5;
    return { progress, isWarning, isCritical };
  }, [timeLeft, totalTime]);

  const statusText = useMemo(() => {
    if (isCritical) return '🔥 긴급!';
    if (isWarning) return '⚠️ 서두르세요!';
    return '게임 진행 중...';
  }, [isCritical, isWarning]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">⏱️ 남은 시간</span>
          <motion.span
            key={timeLeft}
            initial={{ scale: 1.2, color: '#ff6b6b' }}
            animate={{ scale: 1, color: isCritical ? '#ff6b6b' : isWarning ? '#ffd93d' : '#ffffff' }}
            className={`text-2xl font-bold ${
              isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all duration-300 ${
              isCritical ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {isActive && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-center mt-2"
          >
            <span className="text-white text-sm opacity-80">
              {statusText}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GameTimer; 