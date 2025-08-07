import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PuzzlePiece } from '../types';
import { movePieceInDirection, getConfigByTotalPieces, autoSolvePuzzle, PuzzleMove, initializeOriginalStateLearning, getReferencePathHint } from '../utils/puzzleUtils';

interface PuzzleBoardProps {
  pieces: PuzzlePiece[];
  onPiecesChange: (pieces: PuzzlePiece[]) => void;
  onMove: () => void;
  selectedImage: string;
  level: number;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  pieces,
  onPiecesChange,
  onMove,
  selectedImage,
  level,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPiece, setHintPiece] = useState<{ 
    piece: PuzzlePiece; 
    move: PuzzleMove | null;
    pathInfo?: {
      totalSteps: number;
      description: string;
    };
  } | null>(null);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [solutionMoves, setSolutionMoves] = useState<PuzzleMove[]>([]);
  const [currentSolutionStep, setCurrentSolutionStep] = useState(0);
  const config = useMemo(() => getConfigByTotalPieces(pieces.length), [pieces.length]);
  
  // 반응형 보드 크기 계산
  const boardSize = useMemo(() => {
    const screenWidth = window.innerWidth;
    
    // 모바일에서는 화면 크기에 따라 조정
    if (screenWidth < 640) { // sm 브레이크포인트
      return Math.min(screenWidth - 32, 280); // 모바일에서 최대 280px
    } else if (screenWidth < 768) { // md 브레이크포인트
      return Math.min(screenWidth - 48, 320); // 태블릿에서 최대 320px
    } else {
      return Math.min(screenWidth - 80, 400); // 데스크톱에서 최대 400px
    }
  }, []);
  
  const pieceSize = useMemo(() => boardSize / config.cols, [boardSize, config.cols]);

  // 기준칸과 인접한 조각만 이동 가능한지 확인
  const isPieceMovable = useCallback((piece: PuzzlePiece) => {
    // 기준칸(9번째 칸) 찾기
    const referencePiece = pieces.find(p => p.correctPosition === 8);
    if (!referencePiece) return false;

    // 기준칸 자체는 이동 불가
    if (piece.id === referencePiece.id) return false;

    // 기준칸과 인접한 조각만 이동 가능
    return (
      (Math.abs(piece.currentRow - referencePiece.currentRow) === 1 && piece.currentCol === referencePiece.currentCol) || // 위/아래로 인접
      (Math.abs(piece.currentCol - referencePiece.currentCol) === 1 && piece.currentRow === referencePiece.currentRow)    // 좌/우로 인접
    );
  }, [pieces]);

  // 컴포넌트 마운트 시 원본 상태 학습 초기화
  useEffect(() => {
    console.log('🧠 Initializing original state learning for puzzle hints...');
    try {
      initializeOriginalStateLearning(level);
      console.log('✅ Original state learning initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing original state learning:', error);
    }
  }, [level]);

  // 힌트 기능: 기준칸 방향 기준으로 원본 상태로 돌아가는 힌트 제시
  const getHint = useCallback(() => {
    console.log('💡 Getting comprehensive reference path hint...');
    
    // 기준칸 경로 힌트 가져오기
    const hint = getReferencePathHint(pieces);
    
    if (!hint) {
      console.log('❌ No hint available');
      return null;
    }
    
    console.log(`🎯 Comprehensive hint: ${hint.pathDescription}`);
    console.log(`📊 Total steps to original: ${hint.totalSteps}`);
    console.log(`🔄 Next move: Reference piece should move ${hint.nextMove.direction} to swap with piece ${hint.nextMove.targetPiece.id + 1}`);
    
    return {
      piece: hint.nextMove.targetPiece,
      move: {
        pieceId: hint.nextMove.targetPiece.id,
        direction: hint.nextMove.direction as 'up' | 'down' | 'left' | 'right',
        fromPosition: hint.nextMove.targetPiece.currentPosition,
        toPosition: hint.nextMove.targetPiece.currentPosition // 기준칸과 교환되므로 같은 위치
      },
      pathInfo: {
        totalSteps: hint.totalSteps,
        description: hint.pathDescription
      }
    };
  }, [pieces]);

  const executeSolutionStep = useCallback((moves: PuzzleMove[], stepIndex: number) => {
    if (stepIndex >= moves.length) {
      console.log('✅ Auto-solve completed!');
      setIsAutoSolving(false);
      setSolutionMoves([]);
      setCurrentSolutionStep(0);
      return;
    }
    
    const move = moves[stepIndex];
    const targetPiece = pieces.find(p => p.id === move.pieceId);
    
    if (targetPiece) {
      console.log(`🔄 Executing move ${stepIndex + 1}/${moves.length}: Piece ${move.pieceId} ${move.direction}`);
      
      // 애니메이션 시작
      setIsAnimating(true);
      
      // 이동 실행 - movePieceInDirection 사용
      const newPieces = movePieceInDirection(targetPiece, pieces, move.direction);
      onPiecesChange(newPieces);
      onMove();
      
      // 현재 단계 업데이트
      setCurrentSolutionStep(stepIndex + 1);
      
      // 애니메이션 완료 후 다음 단계로 진행
      setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          executeSolutionStep(moves, stepIndex + 1);
        }, 100); // 애니메이션 완료 후 0.1초 대기
      }, 400); // 0.4초 애니메이션
    } else {
      console.log(`❌ Target piece ${move.pieceId} not found for move ${stepIndex + 1}`);
      setIsAutoSolving(false);
      setSolutionMoves([]);
      setCurrentSolutionStep(0);
      setIsAnimating(false);
    }
  }, [pieces, onPiecesChange, onMove]);

  const handleHintClick = useCallback(() => {
    console.log('🔍 Hint button clicked!');
    const hint = getHint();
    console.log('💡 Hint result:', hint);
    
    if (hint) {
      setHintPiece(hint);
      setShowHint(true);
      
      // 3초 후 힌트 숨기기
      setTimeout(() => {
        setShowHint(false);
        setHintPiece(null);
      }, 3000);
    } else {
      console.log('❌ No hint available for A state');
      // 힌트가 없을 때 사용자에게 알림
      alert('현재 상태에서는 셔플 전 원본 상태(A 상태)로 돌아가는 힌트를 제공할 수 없습니다.');
    }
  }, [getHint]);

  const handleAutoSolve = useCallback(() => {
    console.log('🤖 Starting auto-solve...');
    console.log('📊 Current puzzle state:', pieces.map(p => ({
      id: p.id,
      currentPosition: p.currentPosition,
      correctPosition: p.correctPosition,
      isEmpty: p.isEmpty
    })));
    
    setIsAutoSolving(true);
    
    try {
      // A* 알고리즘을 사용하여 해결 경로 찾기
      const solution = autoSolvePuzzle(pieces);
      
      if (solution && solution.length > 0) {
        console.log(`🎯 Found solution with ${solution.length} moves:`, solution);
        setSolutionMoves(solution);
        setCurrentSolutionStep(0);
        
        // 자동으로 해결 단계 실행
        executeSolutionStep(solution, 0);
      } else {
        console.log('❌ No solution found');
        setIsAutoSolving(false);
      }
    } catch (error) {
      console.error('❌ Error in auto-solve:', error);
      setIsAutoSolving(false);
    }
  }, [pieces, executeSolutionStep]);

  const [selectedPiece] = useState<PuzzlePiece | null>(null);

  const handlePieceClick = useCallback(async (clickedPiece: PuzzlePiece) => {
    if (isAnimating) return;

    // 기준칸(9번째 칸) 찾기
    const referencePiece = pieces.find(p => p.correctPosition === 8);
    if (!referencePiece) return;

    // 클릭한 조각이 기준칸이면 이동 불가
    if (clickedPiece.id === referencePiece.id) return;

    // 클릭한 조각이 기준칸과 인접한지 확인
    const isAdjacent = (
      (Math.abs(clickedPiece.currentRow - referencePiece.currentRow) === 1 && clickedPiece.currentCol === referencePiece.currentCol) || // 위/아래로 인접
      (Math.abs(clickedPiece.currentCol - referencePiece.currentCol) === 1 && clickedPiece.currentRow === referencePiece.currentRow)    // 좌/우로 인접
    );

    if (!isAdjacent) return;

    setIsAnimating(true);
    
    // 클릭한 조각과 기준칸의 위치 교환
    const newPieces = pieces.map(p => ({ ...p }));
    const targetPiece = newPieces.find(p => p.id === clickedPiece.id)!;
    const refPiece = newPieces.find(p => p.id === referencePiece.id)!;
    
    // 위치 교환
    const tempPosition = targetPiece.currentPosition;
    const tempRow = targetPiece.currentRow;
    const tempCol = targetPiece.currentCol;
    
    targetPiece.currentPosition = refPiece.currentPosition;
    targetPiece.currentRow = refPiece.currentRow;
    targetPiece.currentCol = refPiece.currentCol;
    
    refPiece.currentPosition = tempPosition;
    refPiece.currentRow = tempRow;
    refPiece.currentCol = tempCol;

    onPiecesChange(newPieces);
    onMove();
    
    // 힌트 숨기기
    setShowHint(false);
    setHintPiece(null);
    
    // 애니메이션 완료 후 상태 업데이트
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, pieces, onPiecesChange, onMove]);

  // 선택된 조각과 인접한지 확인 (현재 사용되지 않음)
  // const isAdjacentToSelected = useCallback((piece: PuzzlePiece, selectedPiece: PuzzlePiece) => {
  //   const rowDiff = Math.abs(piece.currentRow - selectedPiece.currentRow);
  //   const colDiff = Math.abs(piece.currentCol - selectedPiece.currentCol);
  //   return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  // }, []);

  // 선택된 조각에서 타겟 조각으로의 방향 계산 (현재 사용되지 않음)
  // const getDirectionFromSelectedToTarget = useCallback((selectedPiece: PuzzlePiece, targetPiece: PuzzlePiece) => {
  //   const rowDiff = targetPiece.currentRow - selectedPiece.currentRow;
  //   const colDiff = targetPiece.currentCol - selectedPiece.currentCol;
  //   
  //   if (rowDiff === -1) return 'up';
  //   if (rowDiff === 1) return 'down';
  //   if (colDiff === -1) return 'left';
  //   if (colDiff === 1) return 'right';
  //   
  //   return null;
  // }, []);

  const getPieceStyle = useCallback((piece: PuzzlePiece) => {
    // 배경 이미지 위치 계산 - correctPosition을 기준으로 해당 조각이 원래 있어야 할 위치 계산
    const correctRow = piece.correctRow;
    const correctCol = piece.correctCol;
    
    // 배경 이미지에서 해당 조각의 위치 계산
    const backgroundX = correctCol * pieceSize;
    const backgroundY = correctRow * pieceSize;

    return {
      width: pieceSize,
      height: pieceSize,
      backgroundImage: piece.correctPosition === 8 ? 'none' : `url(${selectedImage})`,
      backgroundPosition: piece.correctPosition === 8 ? 'unset' : `-${backgroundX}px -${backgroundY}px`,
      backgroundSize: piece.correctPosition === 8 ? 'unset' : `${boardSize}px ${boardSize}px`,
      backgroundRepeat: 'no-repeat',
             border: piece.isEmpty 
         ? '2px dashed #6b7280' 
         : piece.correctPosition === 8
         ? '2px solid #374151' // 기준칸은 검은색 테두리
         : isPieceMovable(piece)
         ? '3px solid #fb923c'
         : '1px solid rgba(255, 255, 255, 0.1)',
      boxSizing: 'border-box' as const,
      overflow: 'hidden',
    };
  }, [pieceSize, selectedImage, boardSize, isPieceMovable]);

  const movablePiecesCount = useMemo(() => 
    pieces.filter(p => isPieceMovable(p)).length, [pieces, isPieceMovable]
  );

  return (
    <div
      className="flex flex-col items-center space-y-3 sm:space-y-4"
    >
      <div className="text-center mb-3 sm:mb-4 px-2">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          레벨 {level} - {config.rows}x{config.cols} 퍼즐
        </h3>
        <p className="text-xs sm:text-sm text-white opacity-80">
          빈칸과 인접한 칸을 클릭하면 바로 이동합니다
        </p>
        <p className="text-xs text-green-400 mt-1 sm:mt-2">
          📋 이동 규칙: 빈 칸과 상하좌우로 인접한 조각만 이동 가능
        </p>
        <p className="text-xs text-blue-400 mt-1">
          🎯 목표: {level === 1 ? '1,2,3 / 4,5,6 / 7,8,9' : level === 2 ? '1,2,3,4 / 5,6,7,8 / 9,10,11,12 / 13,14,15,16' : '1,2,3,4,5 / 6,7,8,9,10 / 11,12,13,14,15 / 16,17,18,19,20 / 21,22,23,24,25'} 순서로 완성 (모든 조각 사용)
        </p>
        
        {/* 힌트 버튼 */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleHintClick}
            disabled={movablePiecesCount === 0 || isAnimating}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
              movablePiecesCount === 0 || isAnimating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            💡 원본 상태로 돌아가는 힌트
          </button>
          
          {/* 자동 해결 버튼 */}
          <button
            onClick={handleAutoSolve}
            disabled={isAutoSolving || isAnimating}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
              isAutoSolving || isAnimating
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            🤖 자동 해결
          </button>
        </div>
          
          {showHint && hintPiece && (
            <div className="mt-2 p-2 sm:p-3 bg-purple-900 bg-opacity-50 rounded-lg mx-2">
              <p className="text-xs text-purple-300 mb-2">
                💡 원본 상태로 돌아가는 힌트: {hintPiece.piece.id + 1}번 조각을 {hintPiece.move ? hintPiece.move.direction : '이동'}해보세요!
              </p>
              {hintPiece.pathInfo && (
                <div className="text-xs text-purple-200 space-y-1">
                  <p>📊 총 {hintPiece.pathInfo.totalSteps}단계 이동이 필요합니다</p>
                  <p>🎯 {hintPiece.pathInfo.description}</p>
                </div>
              )}
            </div>
          )}
          
          {/* 선택된 조각 안내 */}
          {selectedPiece && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-900 bg-opacity-50 rounded-lg mx-2">
              <p className="text-xs text-yellow-300 mb-2">
                🎯 선택된 조각: {selectedPiece.id + 1}번 조각
              </p>
              <p className="text-xs text-yellow-200">
                💡 방향키(↑↓←→)를 사용하여 상하좌우로 이동하세요
              </p>
            </div>
          )}

          {/* 자동 해결 진행 상황 */}
          {isAutoSolving && solutionMoves.length > 0 && (
            <div className="mt-2 p-2 bg-blue-900 bg-opacity-50 rounded-lg mx-2">
              <p className="text-xs text-blue-300">
                🔄 자동 해결 중... ({currentSolutionStep}/{solutionMoves.length})
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentSolutionStep / solutionMoves.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

      {/* 퍼즐 보드와 원본 이미지를 반응형으로 배치 */}
      <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
        {/* 원본 이미지 (모바일에서는 위, 데스크톱에서는 왼쪽) */}
        <div className="flex flex-col items-center">
          <div className="text-white text-xs sm:text-sm font-medium mb-2 opacity-80">📷 원본 이미지</div>
          <div 
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-600"
            style={{
              width: boardSize * 0.3, // 퍼즐 보드의 30% 크기로 조정
              height: boardSize * 0.3,
            }}
          >
            <img
              src={selectedImage}
              alt="Original"
              className="w-full h-full object-cover opacity-70" // 살짝 투명하게 처리
              style={{
                width: boardSize * 0.3,
                height: boardSize * 0.3,
              }}
            />
          </div>
        </div>

        {/* 퍼즐 보드 */}
        <div
          className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl"
          style={{
            width: boardSize,
            height: boardSize,
            position: 'relative',
          }}
        >
        <AnimatePresence>
          {pieces.map((piece) => {
            // 좌표 기반 위치 계산
            const row = piece.currentRow;
            const col = piece.currentCol;
            
            return (
              <motion.div
                key={piece.id}
                                 className={`absolute transition-all duration-200 ${
                   selectedPiece && piece.id === selectedPiece.id
                     ? isAnimating 
                       ? 'border-4 border-orange-400 shadow-lg shadow-orange-400/50'
                       : 'border-4 border-yellow-400 shadow-lg shadow-yellow-400/50'
                     : piece.correctPosition === 8
                     ? 'bg-black border-2 border-gray-600 cursor-default' // 기준칸을 검은색 빈칸으로 처리
                     : isPieceMovable(piece)
                     ? showHint && hintPiece && piece.id === hintPiece.piece.id
                       ? 'hover:brightness-110 hover:scale-105 border-3 border-purple-400 shadow-lg shadow-purple-400/50 cursor-pointer'
                       : 'hover:brightness-110 hover:scale-105 border-3 border-orange-400 shadow-lg shadow-orange-400/50 cursor-pointer'
                     : 'hover:brightness-110 hover:scale-105 opacity-40 cursor-pointer'
                 }`}
                                  style={{
                   ...getPieceStyle(piece),
                   top: `${row * pieceSize}px`,
                   left: `${col * pieceSize}px`,
                   position: 'absolute',
                   transform: isAnimating && selectedPiece && piece.id === selectedPiece.id ? 'scale(1.05)' : 'scale(1)',
                   transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                   animation: (selectedPiece && piece.id === selectedPiece.id) || 
                              (isPieceMovable(piece) && showHint && hintPiece && piece.id === hintPiece.piece.id) ||
                              (isPieceMovable(piece) && !showHint)
                              ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                              : 'none'
                 }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1,
                  opacity: 1 
                }}
                animate={{ 
                  x: 0, 
                  y: 0, 
                  scale: isAnimating && selectedPiece && piece.id === selectedPiece.id ? 1.1 : 1,
                  opacity: 1 
                }}
                exit={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0.8,
                  opacity: 0 
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.6,
                  ease: "easeInOut"
                }}
                onClick={piece.correctPosition === 8 ? undefined : () => handlePieceClick(piece)}
                whileHover={!piece.isEmpty && !isAnimating && piece.correctPosition !== 8 ? { 
                  scale: 1.05,
                  zIndex: 10 
                } : {}}
                whileTap={!piece.isEmpty && !isAnimating && piece.correctPosition !== 8 ? { 
                  scale: 0.95 
                } : {}}
                drag={false}
                dragConstraints={false}
                dragElastic={0}
              >

                {!piece.isEmpty && isPieceMovable(piece) && (
                  <div className={`absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg ${
                    showHint && hintPiece && piece.id === hintPiece.piece.id
                      ? 'bg-purple-400'
                      : 'bg-green-400'
                  }`}
                  style={{
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>
                    <span className="text-white text-xs font-bold">
                      {showHint && hintPiece && piece.id === hintPiece.piece.id ? '💡' : '→'}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div> {/* Close the flex container for original image and puzzle board */}

      <div className="text-center text-white opacity-80 px-2">
        <p className="text-xs sm:text-sm">
          총 {pieces.length}개 조각 중 {movablePiecesCount}개 이동 가능
        </p>
        <p className="text-xs text-gray-400 mt-1">
          💡 검은색: 빈칸, 주황색: 이동 가능한 조각, 보라색: 힌트 조각
        </p>
        {isAnimating && (
          <p className="text-xs text-yellow-400 mt-1"
             style={{
               animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
             }}>
            🔄 조각이 이동 중입니다...
          </p>
        )}
      </div>
    </div>
  );
};

export default PuzzleBoard; 