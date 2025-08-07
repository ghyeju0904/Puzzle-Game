// @ts-ignore
import React, { useState, useEffect, useCallback } from 'react';
// @ts-ignore
import { motion } from 'framer-motion';
import WalletConnect from './components/WalletConnect';
import ImageUpload from './components/ImageUpload';
import PuzzleBoard from './components/PuzzleBoard';
import GameTimer from './components/GameTimer';
import GameStats from './components/GameStats';
import GameResult from './components/GameResult';
import { useWeb3 } from './hooks/useWeb3';
import { useSound } from './hooks/useSound';
import { PuzzlePiece, GameState } from './types';
import { createPuzzlePieces, isPuzzleCompleted, shufflePuzzleWithCoordinates, shuffleWithReferenceMovements } from './utils/puzzleUtils';

const App: React.FC = () => {
  const { web3State, sendReward } = useWeb3();
  const { playClick, playCheer, playMeow } = useSound();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [gameReady, setGameReady] = useState<boolean>(false); // 게임 준비 상태 추가
  const [isShuffling, setIsShuffling] = useState<boolean>(false); // 셔플 중 상태 추가
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isCompleted: false,
    isFailed: false,
    currentLevel: 1,
    timeLeft: 180, // 3분으로 변경
    moves: 0,
    score: 100, // 100점부터 시작
    startTime: null,
  });
  const [isShuffled, setIsShuffled] = useState<boolean>(false); // 셔플 여부 추적



  // Timer effect
  useEffect(() => {
    let interval: any;
    
    if (gameState.isPlaying && gameState.timeLeft > 0 && !gameState.isCompleted) {
      interval = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            playMeow();
            return {
              ...prev,
              timeLeft: 0,
              isPlaying: false,
              isFailed: true,
            };
          }
          
          return {
            ...prev,
            timeLeft: newTimeLeft,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isPlaying, gameState.timeLeft, gameState.isCompleted, playMeow]);

  // Check for puzzle completion - only when game is actively being played and puzzle is shuffled
  useEffect(() => {
    if (gameState.isPlaying && pieces.length > 0 && isShuffled) {
      const completed = isPuzzleCompleted(pieces);
      console.log('Puzzle completion check:', {
        isPlaying: gameState.isPlaying,
        piecesLength: pieces.length,
        moves: gameState.moves,
        isShuffled: isShuffled,
        completed: completed
      });
      
      if (completed) {
        playCheer();
        
        // 15초 이내 완성 시 보너스 점수 계산
        const timeUsed = 180 - gameState.timeLeft; // 사용된 시간 계산
        const isQuickCompletion = timeUsed <= 15; // 15초 이내 완성 여부
        const bonusPoints = isQuickCompletion ? 20 : 0; // 보너스 점수
        const finalScore = gameState.score + bonusPoints; // 최종 점수
        
        console.log(`🎉 Puzzle completed! Time used: ${timeUsed}s, Quick completion: ${isQuickCompletion}, Bonus: +${bonusPoints} points`);
        
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          isCompleted: true,
          score: finalScore, // 보너스 점수가 적용된 최종 점수
        }));
      }
    }
  }, [pieces, gameState.isPlaying, gameState.moves, gameState.timeLeft, gameState.score, isShuffled, playCheer]);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
      
      // 사진 업로드 시 3x3 퍼즐 생성 (섞지 않고 분할만)
      console.log('📸 Image uploaded, creating 3x3 puzzle (divided only)...');
      const puzzlePieces = createPuzzlePieces(1); // 1단계: 3x3 분할만
      console.log('🎲 3x3 puzzle created (divided, not shuffled):', puzzlePieces);
      
      setPieces(puzzlePieces);
      
      // 게임 준비 상태로 설정
      setGameReady(true);
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        isCompleted: false,
        isFailed: false,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  

  const startNewGame = useCallback((level: number, imageUrl: string) => {
    console.log('🚀 Starting new game with level:', level);
    
    // 게임 시작 시점에 강력한 셔플로 퍼즐 조각들 생성
    const basePieces = createPuzzlePieces(level);
    console.log('📦 Created base pieces:', basePieces);
    
    // 좌표 기반 셔플 사용
    const shuffledPieces = shufflePuzzleWithCoordinates(basePieces);
    console.log('🎲 Final shuffled pieces for game:', shuffledPieces);
    
    setPieces(shuffledPieces);
    setGameReady(false); // 게임 시작 시 준비 상태 해제
         setGameState({
       isPlaying: true,
       isCompleted: false,
       isFailed: false,
       currentLevel: level,
       timeLeft: 180, // 3분으로 변경
       moves: 0,
       score: 100, // 100점부터 시작
       startTime: Date.now(),
     });
    
    console.log('✅ Game started with shuffled pieces');
  }, []);





  const handleStartGame = useCallback(() => {
    if (selectedImage && pieces.length > 0) {
      // 현재 퍼즐 상태로 게임 시작 (섞인 상태면 섞인대로, 안 섞인 상태면 안 섞인대로)
      console.log('🚀 Starting game with current puzzle state');
      setGameReady(false); // 게임 시작 시 준비 상태 해제
             setGameState({
         isPlaying: true,
         isCompleted: false,
         isFailed: false,
         currentLevel: 1,
         timeLeft: 180, // 3분으로 변경
         moves: 0,
         score: 100, // 100점부터 시작
         startTime: Date.now(),
       });
      setIsShuffled(false); // 게임 시작 시 셔플 상태 초기화
      
      console.log('✅ Game started with current pieces');
    }
  }, [selectedImage, pieces.length]);

  // 셔플 버튼 핸들러 (기준칸 기반 셔플) - 여러 번 사용 가능
  const handleShufflePuzzle = useCallback(() => {
    if (pieces.length > 0 && !isShuffling) {
      console.log('🔀 Shuffle button clicked: shuffling puzzle with reference movements...');
      
      setIsShuffling(true); // 셔플 시작
      
      // 비동기로 셔플 실행 (UI 블로킹 방지)
      setTimeout(() => {
        // 기준칸을 움직여서 원본 사진으로 복귀할 수 있는 범위 내에서 섞기
        const shuffledPieces = shuffleWithReferenceMovements([...pieces], gameState.currentLevel);
        setPieces(shuffledPieces);
        setIsShuffled(true); // 셔플 완료 표시
        setIsShuffling(false); // 셔플 완료
        
        // 셔플 횟수 표시를 위한 상태 업데이트
        setGameState(prev => ({
          ...prev,
          moves: 0, // 셔플 시 이동 횟수 초기화
        }));
        
        console.log('✅ Puzzle shuffled with reference movements (can be shuffled again)');
      }, 100); // 짧은 지연으로 UI 반응성 유지
    }
  }, [pieces, gameState.currentLevel, isShuffling]);

  const handlePieceMove = useCallback(() => {
    playClick();
    setGameState(prev => {
      const newMoves = prev.moves + 1;
      
      // 30번째 움직임까지는 2점씩, 그 이후에는 5점씩 감점
      const pointsToDeduct = newMoves <= 30 ? 2 : 5;
      const newScore = prev.score - pointsToDeduct;
      
      console.log(`🔄 Move ${newMoves}: Deducting ${pointsToDeduct} points (${newScore} remaining)`);
      
      // 점수가 0 이하가 되면 게임 실패
      if (newScore <= 0) {
        playMeow(); // 실패 사운드
        return {
          ...prev,
          moves: newMoves,
          score: 0,
          isPlaying: false,
          isFailed: true,
        };
      }
      
      return {
        ...prev,
        moves: newMoves,
        score: newScore,
      };
    });
  }, [playClick, playMeow]);

  const handleNextLevel = useCallback(() => {
    if (gameState.currentLevel < 3) {
      startNewGame(gameState.currentLevel + 1, selectedImage!);
    } else {
      // Game completed
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        isCompleted: false,
        isFailed: false,
      }));
    }
  }, [gameState.currentLevel, startNewGame, selectedImage]);

  const handleRetry = useCallback(() => {
    if (selectedImage) {
      startNewGame(gameState.currentLevel, selectedImage);
    }
  }, [startNewGame, gameState.currentLevel, selectedImage]);

  const handleShare = useCallback(() => {
    // Farcaster sharing logic would go here
         const shareText = `🧩 퍼즐 완성! 레벨 ${gameState.currentLevel}을 ${180 - gameState.timeLeft}초 만에 클리어했습니다! #PuzzleWeb3 #Farcaster`;
    
    // For demo purposes, just copy to clipboard
    navigator.clipboard.writeText(shareText);
    alert('공유 텍스트가 클립보드에 복사되었습니다!');
  }, [gameState.currentLevel, gameState.timeLeft]);

  const handleSendReward = useCallback(async () => {
    try {
      const success = await sendReward('0.0001'); // Small amount for demo
      if (success) {
        alert('🎉 0.2 Puzzle Points가 지급되었습니다!');
      } else {
        alert('❌ 보상 지급에 실패했습니다.');
      }
    } catch (error) {
      console.error('Reward error:', error);
      alert('❌ 보상 지급 중 오류가 발생했습니다.');
    }
  }, [sendReward]);

  const resetGame = useCallback(() => {
    setSelectedImage(null);
    setPieces([]);
    setGameReady(false);
    setIsShuffled(false);
    setIsShuffling(false); // 셔플 상태도 초기화
         setGameState({
       isPlaying: false,
       isCompleted: false,
       isFailed: false,
       currentLevel: 1,
       timeLeft: 180, // 3분으로 변경
       moves: 0,
       score: 100, // 100점부터 시작
       startTime: null,
     });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            🧩 Puzzle Web3 Mini Game
          </h1>
          <p className="text-white opacity-80">
            사진 업로드 기반 슬라이드 퍼즐 + Web3 보상 시스템
          </p>
        </motion.div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {/* Main Game Area */}
        <div className="max-w-4xl mx-auto">
          {!selectedImage ? (
            // Image Upload Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                🎮 게임을 시작하려면 사진을 업로드하세요
              </h2>
              <ImageUpload
                onImageUpload={handleImageUpload}
                selectedImage={selectedImage}
              />
            </motion.div>
          ) : gameReady && !gameState.isPlaying ? (
            // Game Ready Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎯 게임 준비 완료!
                </h2>
                <div className="mb-6">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-64 h-64 object-cover rounded-lg shadow-lg mx-auto"
                  />
                </div>
                <p className="text-white opacity-80 mb-6">
                  선택한 이미지가 {gameState.currentLevel === 1 ? '3×3' : gameState.currentLevel === 2 ? '4×4' : '5×5'}으로 분할되었습니다.
                  <br />
                  게임 시작 버튼을 눌러 퍼즐을 시작하세요!
                </p>
                
                <div className="flex justify-center mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                  >
                    🚀 게임 시작하기
                  </motion.button>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🏠 메인으로 돌아가기
              </motion.button>
            </motion.div>
          ) : (
            // Game Screen
            <div className="space-y-6">
              {/* Game Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <GameTimer
                   timeLeft={gameState.timeLeft}
                   totalTime={180}
                   isActive={gameState.isPlaying}
                 />
                 <GameStats
                   moves={gameState.moves}
                   level={gameState.currentLevel}
                   timeLeft={gameState.timeLeft}
                   totalTime={180}
                   score={gameState.score}
                 />
              </div>

              {/* Puzzle Board */}
              <PuzzleBoard
                pieces={pieces}
                onPiecesChange={setPieces}
                onMove={handlePieceMove}
                selectedImage={selectedImage}
                level={gameState.currentLevel}
              />

                             {/* Game Controls */}
               <div className="flex justify-center space-x-4">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={handleShufflePuzzle}
                   disabled={isShuffling}
                   className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                     isShuffling 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-blue-500 hover:bg-blue-600 text-white'
                   }`}
                 >
                   {isShuffling ? '🔄 섞는 중...' : `🎲 퍼즐 섞기 ${isShuffled ? '(다시 섞기)' : '(9번 조각으로 원본 복원 가능)'}`}
                 </motion.button>
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={resetGame}
                   className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                 >
                   🏠 메인으로 돌아가기
                 </motion.button>
               </div>
            </div>
          )}
        </div>

        {/* Game Result Modal */}
        {(gameState.isCompleted || gameState.isFailed) && (
          <GameResult
            isSuccess={gameState.isCompleted}
            timeLeft={gameState.timeLeft}
            moves={gameState.moves}
            level={gameState.currentLevel}
            score={gameState.score}
            onNextLevel={handleNextLevel}
            onRetry={handleRetry}
            onShare={handleShare}
            web3Connected={web3State.isConnected}
            onSendReward={handleSendReward}
          />
        )}
      </div>
    </div>
  );
};

export default App; 