import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface GameStatsProps {
  moves: number;
  level: number;
  timeLeft: number;
  totalTime: number;
  score: number; // 점수 추가
}

const GameStats: React.FC<GameStatsProps> = ({ moves, level, timeLeft, totalTime, score }) => {
  const { deductionRate } = useMemo(() => {
    const deductionRate = moves <= 30 ? 2 : 5; // 30번째 움직임까지는 2점, 그 이후에는 5점
    return { deductionRate };
  }, [moves]);

  const stats = useMemo(() => [
    { value: score, label: '현재 점수', color: score <= 20 ? 'text-red-400' : score <= 50 ? 'text-yellow-400' : 'text-green-400' },
    { value: moves, label: '이동 횟수', color: 'text-white' },
    { value: level, label: '현재 레벨', color: 'text-white' },
    { value: `${deductionRate}점/이동`, label: '감점 비율', color: moves > 30 ? 'text-red-400' : 'text-yellow-400' }
  ], [moves, level, score, deductionRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs sm:text-sm text-white opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameStats; 