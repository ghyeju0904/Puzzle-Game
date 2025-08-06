// @ts-ignore
import React, { useMemo } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';

interface GameStatsProps {
  moves: number;
  level: number;
  timeLeft: number;
  totalTime: number;
}

const GameStats: React.FC<GameStatsProps> = ({ moves, level, timeLeft, totalTime }) => {
  const { timeUsed, efficiency } = useMemo(() => {
    const timeUsed = totalTime - timeLeft;
    const efficiency = moves > 0 ? (timeUsed / moves).toFixed(1) : '0.0';
    return { timeUsed, efficiency };
  }, [moves, timeLeft, totalTime]);

  const stats = useMemo(() => [
    { value: moves, label: '이동 횟수' },
    { value: level, label: '현재 레벨' },
    { value: `${timeUsed}s`, label: '사용 시간' },
    { value: efficiency, label: '초/이동' }
  ], [moves, level, timeUsed, efficiency]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameStats; 