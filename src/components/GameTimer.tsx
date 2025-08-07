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
  const { progress, isWarning, isCritical, shouldBlink } = useMemo(() => {
    // 남은 시간 비율 계산 (100%에서 시작해서 0%로 감소)
    const progress = (timeLeft / totalTime) * 100;
    const isWarning = timeLeft <= 30; // 30초 이하에서 경고
    const isCritical = timeLeft <= 10; // 10초 이하에서 긴급
    const shouldBlink = timeLeft <= 30; // 30초 이하에서 깜빡임
    return { progress, isWarning, isCritical, shouldBlink };
  }, [timeLeft, totalTime]);

  const statusText = useMemo(() => {
    if (isCritical) return '🔥 긴급!';
    if (isWarning) return '⚠️ 서두르세요!';
    return '게임 진행 중...';
  }, [isCritical, isWarning]);

  const progressColor = useMemo(() => {
    if (isCritical) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-green-500';
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
            animate={{ 
              scale: 1, 
              color: isCritical ? '#ff6b6b' : isWarning ? '#ffd93d' : '#ffffff',
              opacity: shouldBlink ? [1, 0.3, 1] : 1
            }}
            transition={{
              opacity: shouldBlink ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}
            }}
            className={`text-2xl font-bold ${
              isCritical ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>

        {/* 초록색 띠가 줄어드는 프로그레스 바 */}
        <div className="w-full bg-gray-700 rounded-full h-3 shadow-inner">
          <motion.div
            className={`h-3 rounded-full transition-all duration-500 ease-out shadow-lg ${progressColor}`}
            style={{ width: `${progress}%` }}
            initial={{ width: '100%' }}
            animate={{ 
              width: `${progress}%`,
              opacity: shouldBlink ? [1, 0.5, 1] : 1
            }}
            transition={{ 
              width: { duration: 0.5, ease: "easeOut" },
              opacity: shouldBlink ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}
            }}
          />
        </div>

        {/* 남은 시간 비율 표시 */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-300">남은 시간</span>
          <motion.span 
            className="text-xs text-gray-300"
            animate={{ 
              opacity: shouldBlink ? [1, 0.3, 1] : 1
            }}
            transition={{
              opacity: shouldBlink ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}
            }}
          >
            {Math.round(progress)}%
          </motion.span>
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