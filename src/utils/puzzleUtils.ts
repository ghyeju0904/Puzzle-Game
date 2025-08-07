import { PuzzlePiece } from '../types';

interface PuzzleConfig {
  level: number;
  rows: number;
  cols: number;
  totalPieces: number;
  timeLimit: number;
}

export const PUZZLE_CONFIGS: PuzzleConfig[] = [
  { level: 1, rows: 3, cols: 3, totalPieces: 9, timeLimit: 180 },
  { level: 2, rows: 4, cols: 4, totalPieces: 16, timeLimit: 180 },
  { level: 3, rows: 5, cols: 5, totalPieces: 25, timeLimit: 180 },
];

// 좌표 기반 퍼즐 조각 생성 (빈 칸 없이 모든 조각 사용)
export const createPuzzlePieces = (level: number): PuzzlePiece[] => {
  const config = PUZZLE_CONFIGS.find(c => c.level === level);
  if (!config) throw new Error(`Invalid level: ${level}`);

  const pieces: PuzzlePiece[] = [];
  const totalPieces = config.totalPieces;

  console.log(`🎯 Creating ${config.rows}x${config.cols} puzzle with ${totalPieces} pieces (no empty space)`);
  
  // 레벨에 따른 위치 매핑 설명 (빈 칸 없음)
  if (config.level === 1) {
    console.log(`📋 Position mapping: 1,2,3 / 4,5,6 / 7,8,9 (모든 조각 사용)`);
  } else if (config.level === 2) {
    console.log(`📋 Position mapping: 1,2,3,4 / 5,6,7,8 / 9,10,11,12 / 13,14,15,16 (모든 조각 사용)`);
  } else if (config.level === 3) {
    console.log(`📋 Position mapping: 1,2,3,4,5 / 6,7,8,9,10 / 11,12,13,14,15 / 16,17,18,19,20 / 21,22,23,24,25 (모든 조각 사용)`);
  }

  // 각 조각에 1~totalPieces번 위치 할당 (빈 칸 없이 모든 조각 사용)
  for (let i = 0; i < totalPieces; i++) {
    const row = Math.floor(i / config.cols);
    const col = i % config.cols;
    // positionNumber = i + 1; // 1~totalPieces번 위치 (사용하지 않음)
    
    pieces.push({
      id: i,
      currentPosition: i,
      correctPosition: i, // 올바른 위치 (1~totalPieces번)
      isEmpty: false, // 빈 칸 없음
      currentRow: row,
      currentCol: col,
      correctRow: row,
      correctCol: col,
    });
  }

  console.log('🎲 Original puzzle state (모든 조각 사용, 섞지 않음):', pieces.map(p => ({
    id: p.id,
    position: p.currentPosition + 1, // 1~totalPieces번으로 표시
    isEmpty: p.isEmpty,
    row: p.currentRow,
    col: p.currentCol
  })));

  console.log(`📸 원본 사진이 ${config.rows}×${config.cols}으로 분할되었습니다. (빈 칸 없이 모든 조각 사용)`);
    
  return pieces; // 섞지 않고 원본 순서 그대로 반환
};

// 분할된 퍼즐을 섞는 함수 (셔플 버튼용)
export const shuffleDividedPuzzle = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  console.log('🔀 셔플 버튼 클릭: 분할된 사진을 무작위로 섞기 시작...');
  
  // 섞기 전 원본 상태 저장
  const originalPieces = [...pieces];
  console.log('📸 Original image state before shuffling:', originalPieces.map(p => ({
    id: p.id,
    position: p.currentPosition + 1,
    isEmpty: p.isEmpty
  })));

  // 퍼즐 섞기 (항상 해결 가능하도록)
  const shuffledPieces = shufflePuzzleWithCoordinates([...pieces]);
  console.log('🎲 Shuffled puzzle state:', shuffledPieces.map(p => ({
    id: p.id,
    position: p.currentPosition + 1,
    isEmpty: p.isEmpty
  })));
  
  return shuffledPieces;
};

// 간단한 셔플 함수 (빈 칸 없이 조각들끼리 위치 교환)
export const shufflePuzzleWithCoordinates = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  console.log('🔀 Starting simple shuffle for return to original order...');
  let shuffled = [...pieces];
  
  // 1000번의 랜덤 조각 교환
  console.log('🔄 Starting 1000 random piece swaps');
  for (let i = 0; i < 1000; i++) {
    // 랜덤하게 두 조각 선택하여 위치 교환
    const randomIndex1 = Math.floor(Math.random() * shuffled.length);
    const randomIndex2 = Math.floor(Math.random() * shuffled.length);
    
    if (randomIndex1 !== randomIndex2) {
      // 위치 교환
      const temp = shuffled[randomIndex1];
      shuffled[randomIndex1] = shuffled[randomIndex2];
      shuffled[randomIndex2] = temp;
      
      // 좌표 업데이트
      const tempRow = shuffled[randomIndex1].currentRow;
      const tempCol = shuffled[randomIndex1].currentCol;
      const tempPosition = shuffled[randomIndex1].currentPosition;
      
      shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
      shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
      shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
      
      shuffled[randomIndex2].currentRow = tempRow;
      shuffled[randomIndex2].currentCol = tempCol;
      shuffled[randomIndex2].currentPosition = tempPosition;
    }
  }
  
  console.log('✅ Shuffle completed with 1000 random swaps');
  return shuffled;
};

export const shufflePuzzle = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  let shuffled = [...pieces];
  
  // 빈 칸 없이 조각들끼리 랜덤 교환
  for (let i = 0; i < 1000; i++) {
    const randomIndex1 = Math.floor(Math.random() * shuffled.length);
    const randomIndex2 = Math.floor(Math.random() * shuffled.length);
    
    if (randomIndex1 !== randomIndex2) {
      // 위치 교환
      const temp = shuffled[randomIndex1];
      shuffled[randomIndex1] = shuffled[randomIndex2];
      shuffled[randomIndex2] = temp;
      
      // 좌표 업데이트
      const tempRow = shuffled[randomIndex1].currentRow;
      const tempCol = shuffled[randomIndex1].currentCol;
      const tempPosition = shuffled[randomIndex1].currentPosition;
      
      shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
      shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
      shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
      
      shuffled[randomIndex2].currentRow = tempRow;
      shuffled[randomIndex2].currentCol = tempCol;
      shuffled[randomIndex2].currentPosition = tempPosition;
    }
  }

  return shuffled;
};

// 해결 가능한 상태로만 셔플하는 함수 (빈 칸 없음)
export const shufflePuzzleAdvanced = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  console.log('🔀 Starting advanced shuffle with pieces:', pieces);
  let shuffled = [...pieces];
  
  // 1단계: 기본 이동 셔플 (3000번)
  console.log('🔄 Phase 1: Starting 3000 basic moves shuffle');
  for (let i = 0; i < 3000; i++) {
    const randomIndex1 = Math.floor(Math.random() * shuffled.length);
    const randomIndex2 = Math.floor(Math.random() * shuffled.length);
    
    if (randomIndex1 !== randomIndex2) {
      // 위치 교환
      const temp = shuffled[randomIndex1];
      shuffled[randomIndex1] = shuffled[randomIndex2];
      shuffled[randomIndex2] = temp;
      
      // 좌표 업데이트
      const tempRow = shuffled[randomIndex1].currentRow;
      const tempCol = shuffled[randomIndex1].currentCol;
      const tempPosition = shuffled[randomIndex1].currentPosition;
      
      shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
      shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
      shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
      
      shuffled[randomIndex2].currentRow = tempRow;
      shuffled[randomIndex2].currentCol = tempCol;
      shuffled[randomIndex2].currentPosition = tempPosition;
    }
  }
  
  // 2단계: 추가 이동 셔플 (1500번)
  console.log('🔄 Phase 2: Starting 1500 additional moves shuffle');
  for (let i = 0; i < 1500; i++) {
    const randomIndex1 = Math.floor(Math.random() * shuffled.length);
    const randomIndex2 = Math.floor(Math.random() * shuffled.length);
    
    if (randomIndex1 !== randomIndex2) {
      // 위치 교환
      const temp = shuffled[randomIndex1];
      shuffled[randomIndex1] = shuffled[randomIndex2];
      shuffled[randomIndex2] = temp;
      
      // 좌표 업데이트
      const tempRow = shuffled[randomIndex1].currentRow;
      const tempCol = shuffled[randomIndex1].currentCol;
      const tempPosition = shuffled[randomIndex1].currentPosition;
      
      shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
      shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
      shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
      
      shuffled[randomIndex2].currentRow = tempRow;
      shuffled[randomIndex2].currentCol = tempCol;
      shuffled[randomIndex2].currentPosition = tempPosition;
    }
  }
  
  // 3단계: 최종 이동 셔플 (1000번)
  console.log('🔄 Phase 3: Starting 1000 final moves shuffle');
  for (let i = 0; i < 1000; i++) {
    const randomIndex1 = Math.floor(Math.random() * shuffled.length);
    const randomIndex2 = Math.floor(Math.random() * shuffled.length);
    
    if (randomIndex1 !== randomIndex2) {
      // 위치 교환
      const temp = shuffled[randomIndex1];
      shuffled[randomIndex1] = shuffled[randomIndex2];
      shuffled[randomIndex2] = temp;
      
      // 좌표 업데이트
      const tempRow = shuffled[randomIndex1].currentRow;
      const tempCol = shuffled[randomIndex1].currentCol;
      const tempPosition = shuffled[randomIndex1].currentPosition;
      
      shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
      shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
      shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
      
      shuffled[randomIndex2].currentRow = tempRow;
      shuffled[randomIndex2].currentCol = tempCol;
      shuffled[randomIndex2].currentPosition = tempPosition;
    }
  }
  
  // 셔플 결과 확인
  const isCompleted = isPuzzleCompleted(shuffled);
  console.log(`✅ Shuffle completed. Total moves: 5500. Puzzle completed: ${isCompleted}`);
  
  if (isCompleted) {
    console.log('⚠️ Puzzle was completed after shuffle, doing additional moves...');
    // 추가 이동으로 더 섞기
    for (let i = 0; i < 500; i++) {
      const randomIndex1 = Math.floor(Math.random() * shuffled.length);
      const randomIndex2 = Math.floor(Math.random() * shuffled.length);
      
      if (randomIndex1 !== randomIndex2) {
        // 위치 교환
        const temp = shuffled[randomIndex1];
        shuffled[randomIndex1] = shuffled[randomIndex2];
        shuffled[randomIndex2] = temp;
        
        // 좌표 업데이트
        const tempRow = shuffled[randomIndex1].currentRow;
        const tempCol = shuffled[randomIndex1].currentCol;
        const tempPosition = shuffled[randomIndex1].currentPosition;
        
        shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
        shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
        shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
        
        shuffled[randomIndex2].currentRow = tempRow;
        shuffled[randomIndex2].currentCol = tempCol;
        shuffled[randomIndex2].currentPosition = tempPosition;
      }
    }
    console.log('✅ Additional moves completed to ensure puzzle is not completed');
  }
  
  console.log('🎉 Shuffle successful! Puzzle is ready for game.');
  console.log('🏁 Final shuffled pieces:', shuffled);
  return shuffled;
};

// 간단하고 확실한 셔플 함수
export const shufflePuzzleSimple = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  console.log('🧪 Simple shuffle starting...');
  let shuffled = [...pieces];
  
  // 빈 칸의 초기 위치 찾기
  let emptyIndex = shuffled.findIndex(p => p.isEmpty);
  console.log(`🎯 Initial empty position: ${emptyIndex}`);
  
  // 충분한 이동으로 셔플 (1000번)
  console.log('🔄 Starting 1000 moves shuffle');
  for (let i = 0; i < 1000; i++) {
    const adjacentPositions = getAdjacentPositions(emptyIndex, shuffled.length);
    const randomAdjacent = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
    
    // 위치 교환
    const temp = shuffled[emptyIndex];
    shuffled[emptyIndex] = shuffled[randomAdjacent];
    shuffled[randomAdjacent] = temp;
    
    emptyIndex = randomAdjacent;
  }
  
  // 셔플 결과 확인
  const isCompleted = isPuzzleCompleted(shuffled);
  console.log(`✅ Simple shuffle completed. Total moves: 1000. Puzzle completed: ${isCompleted}`);
  
  if (isCompleted) {
    console.log('⚠️ Puzzle was completed, doing 200 more moves...');
    // 추가 이동
    for (let i = 0; i < 200; i++) {
      const adjacentPositions = getAdjacentPositions(emptyIndex, shuffled.length);
      const randomAdjacent = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
      
      const temp = shuffled[emptyIndex];
      shuffled[emptyIndex] = shuffled[randomAdjacent];
      shuffled[randomAdjacent] = temp;
      
      emptyIndex = randomAdjacent;
    }
    console.log('✅ Additional moves completed');
  }
  
  console.log('🎉 Simple shuffle successful!');
  console.log('🏁 Final shuffled pieces:', shuffled);
  return shuffled;
};

export const getAdjacentPositions = (position: number, totalPieces: number): number[] => {
  const config = getConfigByTotalPieces(totalPieces);
  const row = Math.floor(position / config.cols);
  const col = position % config.cols;
  const adjacent: number[] = [];

  // Check all 4 directions
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];

  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    
    if (newRow >= 0 && newRow < config.rows && newCol >= 0 && newCol < config.cols) {
      adjacent.push(newRow * config.cols + newCol);
    }
  }

  return adjacent;
};

export const getConfigByTotalPieces = (totalPieces: number): PuzzleConfig => {
  const config = PUZZLE_CONFIGS.find(c => c.totalPieces === totalPieces);
  if (!config) throw new Error(`Invalid total pieces: ${totalPieces}`);
  return config;
};

// 새로운 함수: 두 조각이 네 변으로 맞닿아있는지 확인
export const arePiecesAdjacent = (piece1: PuzzlePiece, piece2: PuzzlePiece, pieces: PuzzlePiece[]): boolean => {
  const config = getConfigByTotalPieces(pieces.length);
  const piece1Row = Math.floor(piece1.currentPosition / config.cols);
  const piece1Col = piece1.currentPosition % config.cols;
  const piece2Row = Math.floor(piece2.currentPosition / config.cols);
  const piece2Col = piece2.currentPosition % config.cols;

  // 네 변으로 맞닿아있는지 확인 (대각선 제외)
  // 위/아래로 인접: 같은 열에 있고 행 차이가 1
  const isVerticalAdjacent = piece1Col === piece2Col && Math.abs(piece1Row - piece2Row) === 1;
  
  // 좌/우로 인접: 같은 행에 있고 열 차이가 1
  const isHorizontalAdjacent = piece1Row === piece2Row && Math.abs(piece1Col - piece2Col) === 1;

  return isVerticalAdjacent || isHorizontalAdjacent;
};

// 새로운 함수: 조각이 빈 칸과 면이 맞닿아있는지 더 정확하게 확인
export const isPieceFaceAdjacentToEmpty = (piece: PuzzlePiece, pieces: PuzzlePiece[]): boolean => {
  const emptyPiece = pieces.find(p => p.isEmpty);
  if (!emptyPiece) return false;

  return arePiecesAdjacent(piece, emptyPiece, pieces);
};

// 새로운 함수: 조각이 다른 조각과 위치를 바꿀 수 있는지 확인
export const canSwapPieces = (piece1: PuzzlePiece, piece2: PuzzlePiece, pieces: PuzzlePiece[]): boolean => {
  // 빈 조각이 아닌 경우에만 스왑 가능
  if (piece1.isEmpty || piece2.isEmpty) return false;
  
  // 네 변으로 맞닿아있는지 확인
  return arePiecesAdjacent(piece1, piece2, pieces);
};

// 새로운 함수: 두 조각의 위치를 바꾸기
export const swapPieces = (piece1: PuzzlePiece, piece2: PuzzlePiece, pieces: PuzzlePiece[]): PuzzlePiece[] => {
  if (!canSwapPieces(piece1, piece2, pieces)) return pieces;

  const newPieces = [...pieces];
  const targetPiece1 = newPieces.find(p => p.id === piece1.id)!;
  const targetPiece2 = newPieces.find(p => p.id === piece2.id)!;
  
  // 위치 교환
  const tempPosition = targetPiece1.currentPosition;
  const tempRow = targetPiece1.currentRow;
  const tempCol = targetPiece1.currentCol;
  
  targetPiece1.currentPosition = targetPiece2.currentPosition;
  targetPiece1.currentRow = targetPiece2.currentRow;
  targetPiece1.currentCol = targetPiece2.currentCol;
  
  targetPiece2.currentPosition = tempPosition;
  targetPiece2.currentRow = tempRow;
  targetPiece2.currentCol = tempCol;

  return newPieces;
};

// 개선된 이동 가능성 확인 함수
export const canMovePiece = (piece: PuzzlePiece, pieces: PuzzlePiece[]): boolean => {
  // 원본 사진에서 9번째 칸에 있던 조각만 이동 가능
  return piece.correctPosition === 8; // 0-based index이므로 8번이 9번째 칸
};

export const movePiece = (piece: PuzzlePiece, pieces: PuzzlePiece[]): PuzzlePiece[] => {
  if (!canMovePiece(piece, pieces)) return pieces;

  // 원본 사진에서 9번째 칸에 있던 조각만 이동 가능하므로 인접한 조각과 교환
  const pieceRow = piece.currentRow;
  const pieceCol = piece.currentCol;
  
  // 인접한 조각들 찾기 (상하좌우)
  const adjacentPieces = pieces.filter(p => 
    p.id !== piece.id && (
      (Math.abs(p.currentRow - pieceRow) === 1 && p.currentCol === pieceCol) || // 위/아래로 인접
      (Math.abs(p.currentCol - pieceCol) === 1 && p.currentRow === pieceRow)    // 좌/우로 인접
    )
  );
  
  if (adjacentPieces.length === 0) return pieces;
  
  // 랜덤한 인접 조각 선택
  const randomAdjacent = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
  
  const newPieces = pieces.map(p => ({ ...p }));
  const targetPiece = newPieces.find(p => p.id === piece.id)!;
  const adjacentPiece = newPieces.find(p => p.id === randomAdjacent.id)!;
  
  // 위치 교환
  const tempPosition = targetPiece.currentPosition;
  const tempRow = targetPiece.currentRow;
  const tempCol = targetPiece.currentCol;
  
  targetPiece.currentPosition = adjacentPiece.currentPosition;
  targetPiece.currentRow = adjacentPiece.currentRow;
  targetPiece.currentCol = adjacentPiece.currentCol;
  
  adjacentPiece.currentPosition = tempPosition;
  adjacentPiece.currentRow = tempRow;
  adjacentPiece.currentCol = tempCol;

  return newPieces;
};

// 새로운 함수: 조각들끼리 위치 교환 (빈 칸 없음)
export const movePieceInDirection = (
  piece: PuzzlePiece, 
  pieces: PuzzlePiece[], 
  direction: 'up' | 'down' | 'left' | 'right'
): PuzzlePiece[] => {
  // 빈 칸이 없으므로 다른 조각과 위치를 바꿀 수 있음
  const config = getConfigByTotalPieces(pieces.length);
  const pieceRow = piece.currentRow;
  const pieceCol = piece.currentCol;
  
  // 방향에 따른 인접한 조각 찾기
  let targetRow = pieceRow;
  let targetCol = pieceCol;
  
  switch (direction) {
    case 'up':
      targetRow = Math.max(0, pieceRow - 1);
      break;
    case 'down':
      targetRow = Math.min(config.rows - 1, pieceRow + 1);
      break;
    case 'left':
      targetCol = Math.max(0, pieceCol - 1);
      break;
    case 'right':
      targetCol = Math.min(config.cols - 1, pieceCol + 1);
      break;
  }
  
  // 같은 위치면 이동하지 않음
  if (targetRow === pieceRow && targetCol === pieceCol) return pieces;
  
  // 대상 조각 찾기
  const targetPiece = pieces.find(p => p.currentRow === targetRow && p.currentCol === targetCol);
  if (!targetPiece) return pieces;
  
  // 위치 교환
  const newPieces = pieces.map(p => ({ ...p }));
  const sourcePiece = newPieces.find(p => p.id === piece.id)!;
  const destPiece = newPieces.find(p => p.id === targetPiece.id)!;
  
  // 위치와 좌표 교환
  const tempPosition = sourcePiece.currentPosition;
  const tempRow = sourcePiece.currentRow;
  const tempCol = sourcePiece.currentCol;
  
  sourcePiece.currentPosition = destPiece.currentPosition;
  sourcePiece.currentRow = destPiece.currentRow;
  sourcePiece.currentCol = destPiece.currentCol;
  
  destPiece.currentPosition = tempPosition;
  destPiece.currentRow = tempRow;
  destPiece.currentCol = tempCol;
  
  return newPieces;
};

// 새로운 함수: 클릭한 조각의 이동 방향 계산 (빈 칸 없음)
export const getMoveDirection = (
  clickedPiece: PuzzlePiece,
  pieces: PuzzlePiece[]
): 'up' | 'down' | 'left' | 'right' | null => {
  // 빈 칸이 없으므로 인접한 조각과 위치를 바꿀 수 있음
  // const config = getConfigByTotalPieces(pieces.length);
  const pieceRow = clickedPiece.currentRow;
  const pieceCol = clickedPiece.currentCol;
  
  // 인접한 조각들 찾기
  const adjacentPieces = pieces.filter(p => 
    p.id !== clickedPiece.id && (
      (Math.abs(p.currentRow - pieceRow) === 1 && p.currentCol === pieceCol) || // 위/아래로 인접
      (Math.abs(p.currentCol - pieceCol) === 1 && p.currentRow === pieceRow)    // 좌/우로 인접
    )
  );
  
  if (adjacentPieces.length === 0) return null;
  
  // 랜덤하게 인접한 조각 선택
  const randomAdjacent = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
  
  // 방향 계산
  if (randomAdjacent.currentRow < pieceRow) return 'up';
  if (randomAdjacent.currentRow > pieceRow) return 'down';
  if (randomAdjacent.currentCol < pieceCol) return 'left';
  if (randomAdjacent.currentCol > pieceCol) return 'right';
  
  return null;
};

export const isPuzzleCompleted = (pieces: PuzzlePiece[]): boolean => {
  // 모든 조각이 올바른 위치에 있는지 확인 (1~9번 순서)
  const allPiecesInCorrectPosition = pieces.every(piece => 
    piece.currentPosition === piece.correctPosition
  );
  
  // 모든 조각이 올바른 좌표에 있는지도 확인
  const allPiecesInCorrectCoordinates = pieces.every(piece => 
    piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol
  );
  
  // 빈 조각이 올바른 위치에 있는지 확인 (9번 위치)
  const emptyPiece = pieces.find(p => p.isEmpty);
  const emptyInCorrectPosition = emptyPiece ? 
    emptyPiece.currentPosition === emptyPiece.correctPosition : true;
  
  const isCompleted = allPiecesInCorrectPosition && allPiecesInCorrectCoordinates && emptyInCorrectPosition;
  
  if (isCompleted) {
    console.log('🎉 Puzzle completed! All pieces are in correct 1~9번 순서');
    console.log('📋 Final state:', pieces.map(p => ({
      id: p.id,
      position: p.currentPosition + 1, // 1~9번으로 표시
      isEmpty: p.isEmpty
    })));
  } else {
    console.log('🧩 Puzzle completion check:', {
      allPiecesInCorrectPosition,
      allPiecesInCorrectCoordinates,
      emptyInCorrectPosition,
      pieces: pieces.map(p => ({
        id: p.id,
        current: p.currentPosition + 1, // 1~9번으로 표시
        correct: p.correctPosition + 1, // 1~9번으로 표시
        currentRow: p.currentRow,
        currentCol: p.currentCol,
        correctRow: p.correctRow,
        correctCol: p.correctCol,
        isEmpty: p.isEmpty
      }))
    });
  }
  
  return isCompleted;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateScore = (timeLeft: number, moves: number, level: number): number => {
  const baseScore = 1000;
  const timeBonus = timeLeft * 10;
  const movePenalty = moves * 5;
  const levelMultiplier = level * 1.5;
  
  return Math.max(0, Math.floor((baseScore + timeBonus - movePenalty) * levelMultiplier));
}; 

// Inversion count 계산 함수 (정확한 버전)
export const calculateInversionCount = (pieces: PuzzlePiece[]): number => {
  let inversions = 0;
  
  // 빈 조각을 제외한 조각들만 고려
  const nonEmptyPieces = pieces.filter(p => !p.isEmpty);
  
  for (let i = 0; i < nonEmptyPieces.length; i++) {
    for (let j = i + 1; j < nonEmptyPieces.length; j++) {
      // 현재 위치가 목표 위치보다 뒤에 있는 경우 inversion
      if (nonEmptyPieces[i].currentPosition > nonEmptyPieces[j].currentPosition) {
        inversions++;
      }
    }
  }
  
  console.log(`📊 Inversion count: ${inversions} (${inversions % 2 === 0 ? 'even' : 'odd'})`);
  return inversions;
};

// 해결 가능한 상태인지 판단하는 함수 (정확한 버전)
export const isSolvable = (pieces: PuzzlePiece[]): boolean => {
  const config = getConfigByTotalPieces(pieces.length);
  const inversions = calculateInversionCount(pieces);
  
  // 빈 조각의 행 위치 (0부터 시작)
  const emptyPiece = pieces.find(p => p.isEmpty);
  if (!emptyPiece) return false;
  
  const emptyRow = Math.floor(emptyPiece.currentPosition / config.cols);
  const rowFromBottom = config.rows - 1 - emptyRow;
  
  console.log(`🎯 Empty piece at row ${emptyRow} (${rowFromBottom} from bottom)`);
  
  // 3x3 퍼즐의 경우: inversion count가 짝수여야 해결 가능
  if (config.rows === 3 && config.cols === 3) {
    const solvable = inversions % 2 === 0;
    console.log(`🧩 3x3 puzzle: ${solvable ? 'SOLVABLE' : 'UNSOLVABLE'} (inversions: ${inversions})`);
    return solvable;
  }
  
  // 4x3, 5x3 등 다른 크기의 경우: 
  // 빈 조각이 아래에서부터 세었을 때 홀수 번째 행에 있으면 inversion count가 짝수여야 함
  // 빈 조각이 아래에서부터 세었을 때 짝수 번째 행에 있으면 inversion count가 홀수여야 함
  let solvable = false;
  
  if (rowFromBottom % 2 === 0) {
    // 빈 조각이 홀수 번째 행 (아래에서부터)
    solvable = inversions % 2 === 0;
    console.log(`🧩 ${config.rows}x${config.cols} puzzle: ${solvable ? 'SOLVABLE' : 'UNSOLVABLE'} (odd row from bottom, inversions: ${inversions})`);
  } else {
    // 빈 조각이 짝수 번째 행 (아래에서부터)
    solvable = inversions % 2 === 1;
    console.log(`🧩 ${config.rows}x${config.cols} puzzle: ${solvable ? 'SOLVABLE' : 'UNSOLVABLE'} (even row from bottom, inversions: ${inversions})`);
  }
  
  return solvable;
};

// 해결 가능한 상태로 셔플하는 함수 (정확한 버전)
export const shufflePuzzleSolvable = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  console.log('🔀 Starting solvable shuffle with pieces:', pieces);
  let shuffled = [...pieces];
  let attempts = 0;
  const maxAttempts = 100; // 최대 100번 시도
  
  do {
    attempts++;
    console.log(`🔄 Attempt ${attempts}: Shuffling puzzle...`);
    
    // 빈 칸의 초기 위치 찾기
    let emptyIndex = shuffled.findIndex(p => p.isEmpty);
    
    // 충분한 이동으로 셔플 (1500번)
    for (let i = 0; i < 1500; i++) {
      const adjacentPositions = getAdjacentPositions(emptyIndex, shuffled.length);
      const randomAdjacent = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
      
      // 위치 교환
      const temp = shuffled[emptyIndex];
      shuffled[emptyIndex] = shuffled[randomAdjacent];
      shuffled[randomAdjacent] = temp;
      
      emptyIndex = randomAdjacent;
    }
    
    // 해결 가능한지 확인
    const solvable = isSolvable(shuffled);
    const completed = isPuzzleCompleted(shuffled);
    const inversions = calculateInversionCount(shuffled);
    
    console.log(`✅ Attempt ${attempts} completed. Solvable: ${solvable}, Completed: ${completed}, Inversions: ${inversions}`);
    
    // 해결 가능하고 완성되지 않은 상태라면 성공
    if (solvable && !completed) {
      console.log('🎉 Solvable shuffle successful! Puzzle is ready for game.');
      console.log('🏁 Final shuffled pieces:', shuffled);
      return shuffled;
    }
    
    // 실패한 경우 원본으로 다시 시작
    if (attempts < maxAttempts) {
      console.log(`🔄 Puzzle is not solvable or completed, reshuffling... (attempt ${attempts})`);
      shuffled = [...pieces];
    }
    
  } while (attempts < maxAttempts);
  
  // 최대 시도 횟수를 초과한 경우, 마지막 결과 반환
  console.log('⚠️ Maximum attempts reached. Using last shuffle result.');
  return shuffled;
}; 

// 퍼즐 해결 알고리즘 - A* 알고리즘 사용
export const solvePuzzle = (pieces: PuzzlePiece[]): PuzzleMove[] => {
  console.log('🧩 Starting puzzle solver...');
  
  if (isPuzzleCompleted(pieces)) {
    console.log('✅ Puzzle is already completed!');
    return [];
  }
  
  if (!isSolvable(pieces)) {
    console.log('❌ Puzzle is not solvable!');
    return [];
  }
  
  // A* 알고리즘을 위한 노드 클래스
  class PuzzleNode {
    pieces: PuzzlePiece[];
    g: number; // 시작점에서 현재까지의 비용
    h: number; // 휴리스틱 (맨해튼 거리)
    f: number; // f = g + h
    parent: PuzzleNode | null;
    lastMove: PuzzleMove | null;
    
    constructor(pieces: PuzzlePiece[], g: number = 0, parent: PuzzleNode | null = null, lastMove: PuzzleMove | null = null) {
      this.pieces = pieces;
      this.g = g;
      this.h = calculateHeuristic(pieces);
      this.f = this.g + this.h;
      this.parent = parent;
      this.lastMove = lastMove;
    }
    
    // 노드 비교를 위한 해시
    getHash(): string {
      return this.pieces.map(p => `${p.id}:${p.currentPosition}`).join('|');
    }
  }
  
  // 휴리스틱 함수: 맨해튼 거리 계산
  const calculateHeuristic = (pieces: PuzzlePiece[]): number => {
    let totalDistance = 0;
    
    for (const piece of pieces) {
      if (!piece.isEmpty) {
        const currentRow = piece.currentRow;
        const currentCol = piece.currentCol;
        const correctRow = piece.correctRow;
        const correctCol = piece.correctCol;
        
        const distance = Math.abs(currentRow - correctRow) + Math.abs(currentCol - correctCol);
        totalDistance += distance;
      }
    }
    
    return totalDistance;
  };
  
  // 가능한 모든 이동 찾기
  const getPossibleMoves = (pieces: PuzzlePiece[]): PuzzleMove[] => {
    const moves: PuzzleMove[] = [];
    const emptyPiece = pieces.find(p => p.isEmpty);
    if (!emptyPiece) return moves;
    
    const config = getConfigByTotalPieces(pieces.length);
    const emptyRow = emptyPiece.currentRow;
    const emptyCol = emptyPiece.currentCol;
    
    // 상하좌우 인접한 조각들 찾기
    const directions = [
      { row: -1, col: 0, name: 'up' },
      { row: 1, col: 0, name: 'down' },
      { row: 0, col: -1, name: 'left' },
      { row: 0, col: 1, name: 'right' }
    ];
    
    for (const dir of directions) {
      const newRow = emptyRow + dir.row;
      const newCol = emptyCol + dir.col;
      
      if (newRow >= 0 && newRow < config.rows && newCol >= 0 && newCol < config.cols) {
        const targetPosition = newRow * config.cols + newCol;
        const targetPiece = pieces.find(p => p.currentPosition === targetPosition);
        
        if (targetPiece && !targetPiece.isEmpty) {
          moves.push({
            pieceId: targetPiece.id,
            direction: dir.name as 'up' | 'down' | 'left' | 'right',
            fromPosition: targetPiece.currentPosition,
            toPosition: emptyPiece.currentPosition
          });
        }
      }
    }
    
    return moves;
  };
  
  // 이동 적용
  const applyMove = (pieces: PuzzlePiece[], move: PuzzleMove): PuzzlePiece[] => {
    const newPieces = pieces.map(p => ({ ...p }));
    const targetPiece = newPieces.find(p => p.id === move.pieceId);
    const emptyPiece = newPieces.find(p => p.isEmpty);
    
    if (!targetPiece || !emptyPiece) return pieces;
      
      // 위치 교환
    const tempPosition = targetPiece.currentPosition;
    const tempRow = targetPiece.currentRow;
    const tempCol = targetPiece.currentCol;
    
    targetPiece.currentPosition = emptyPiece.currentPosition;
    targetPiece.currentRow = emptyPiece.currentRow;
    targetPiece.currentCol = emptyPiece.currentCol;
    
    emptyPiece.currentPosition = tempPosition;
    emptyPiece.currentRow = tempRow;
    emptyPiece.currentCol = tempCol;
    
    return newPieces;
  };
  
  // A* 알고리즘 실행
  const openSet = new Map<string, PuzzleNode>();
  const closedSet = new Set<string>();
  
  const startNode = new PuzzleNode(pieces);
  openSet.set(startNode.getHash(), startNode);
  
  let iterations = 0;
  const maxIterations = 10000; // 무한 루프 방지
  
  while (openSet.size > 0 && iterations < maxIterations) {
    iterations++;
    
    // f 값이 가장 작은 노드 선택
    let currentNode: PuzzleNode | null = null;
    let minF = Infinity;
    
    const openSetArray = Array.from(openSet.values());
    for (const node of openSetArray) {
      if (node.f < minF) {
        minF = node.f;
        currentNode = node;
      }
    }
    
    if (!currentNode) break;
    
    // 목표 상태에 도달했는지 확인
    if (isPuzzleCompleted(currentNode.pieces)) {
      console.log(`✅ Puzzle solved in ${iterations} iterations!`);
      
      // 경로 재구성
      const solution: PuzzleMove[] = [];
      let node: PuzzleNode | null = currentNode;
      
      while (node && node.lastMove) {
        solution.unshift(node.lastMove);
        node = node.parent;
      }
      
      console.log(`🎯 Solution found with ${solution.length} moves:`, solution);
      return solution;
    }
    
    // 현재 노드를 closed set으로 이동
    const currentHash = currentNode.getHash();
    openSet.delete(currentHash);
    closedSet.add(currentHash);
    
    // 가능한 모든 이동 탐색
    const possibleMoves = getPossibleMoves(currentNode.pieces);
    
    for (const move of possibleMoves) {
      const newPieces = applyMove(currentNode.pieces, move);
      const newHash = newPieces.map(p => `${p.id}:${p.currentPosition}`).join('|');
      
      // 이미 방문한 상태인지 확인
      if (closedSet.has(newHash)) continue;
      
      const newG = currentNode.g + 1;
      const existingNode = openSet.get(newHash);
      
      if (!existingNode || newG < existingNode.g) {
        const newNode = new PuzzleNode(newPieces, newG, currentNode, move);
        openSet.set(newHash, newNode);
      }
    }
  }
  
  console.log('❌ Puzzle solver failed or reached max iterations');
  return [];
};

// 이동 정보 인터페이스
export interface PuzzleMove {
  pieceId: number;
  direction: 'up' | 'down' | 'left' | 'right';
  fromPosition: number;
  toPosition: number;
}

// 자동 해결 기능
export const autoSolvePuzzle = (pieces: PuzzlePiece[]): PuzzleMove[] => {
  console.log('🤖 Starting auto-solve...');
  const solution = solvePuzzle(pieces);
  
  if (solution.length > 0) {
    console.log(`🎉 Auto-solve found solution with ${solution.length} moves`);
  } else {
    console.log('❌ Auto-solve failed');
  }
  
  return solution;
};

// 사용자 제공 함수 스타일의 해결 가능한 퍼즐 생성 (추가 함수)
export const generateSolvablePuzzle = (level: number): PuzzlePiece[] => {
  const config = PUZZLE_CONFIGS.find(c => c.level === level);
  if (!config) throw new Error(`Invalid level: ${level}`);
  
  console.log(`🎯 Generating solvable puzzle for ${config.rows}x${config.cols} grid`);
  
  // 1단계: 기본 퍼즐 조각 생성 (1~9번 순서)
  const basePieces = createPuzzlePieces(level);
  
  // 2단계: 해결 가능한 상태로 셔플
  let solvablePieces: PuzzlePiece[];
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    attempts++;
    console.log(`🔄 Solvable generation attempt ${attempts}/${maxAttempts}`);
    
    // 기본 셔플링 적용
    solvablePieces = shufflePuzzleWithCoordinates(basePieces);
    
    // 해결 가능성 재확인
    const isSolvableState = isSolvable(solvablePieces);
    const isNotCompleted = !isPuzzleCompleted(solvablePieces);
    
    if (isSolvableState && isNotCompleted) {
      console.log(`✅ Solvable puzzle generated successfully on attempt ${attempts}`);
      console.log('🎲 Final solvable state:', solvablePieces.map(p => ({
        id: p.id,
        position: p.currentPosition + 1,
        correct: p.correctPosition + 1,
        isEmpty: p.isEmpty
      })));
      return solvablePieces;
    }
    
    console.log(`❌ Attempt ${attempts} failed - Solvable: ${isSolvableState}, Not Completed: ${isNotCompleted}`);
    
  } while (attempts < maxAttempts);
  
  console.log('⚠️ Failed to generate solvable puzzle after maximum attempts, returning last attempt');
  return solvablePieces;
};

// 역방향 학습을 위한 상태 저장소
interface PuzzleState {
  pieces: PuzzlePiece[];
  moves: PuzzleMove[];
  hash: string;
}

class ReversePuzzleLearner {
  private solvedStates: Map<string, PuzzleMove[]> = new Map();
  private maxDepth: number = 20; // 최대 역방향 이동 깊이
  
  // 원본 상태 생성 (1,2,3 / 4,5,6 / 7,8,9)
  public createOriginalState(): PuzzlePiece[] {
    const pieces: PuzzlePiece[] = [];
    const config = getConfigByTotalPieces(9);
    
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / config.cols);
      const col = i % config.cols;
      const isEmpty = i === 8; // 9번 위치(마지막)가 빈 칸
      
      pieces.push({
        id: i + 1,
        currentPosition: i,
        correctPosition: i,
        currentRow: row,
        currentCol: col,
        correctRow: row,
        correctCol: col,
        isEmpty: isEmpty
      });
    }
    
    return pieces;
  }
  
  // 상태 해시 생성
  private getStateHash(pieces: PuzzlePiece[]): string {
    return pieces.map(p => `${p.id}:${p.currentPosition}`).join('|');
  }
  
  // 역방향으로 모든 가능한 상태 학습 (간소화된 버전)
  public learnAllPossibleStates(): void {
    console.log('🧠 Starting reverse puzzle learning...');
    
    const originalState = this.createOriginalState();
    const originalHash = this.getStateHash(originalState);
    
    // 원본 상태를 해결된 상태로 저장
    this.solvedStates.set(originalHash, []);
    
    // 간소화된 BFS로 상태 탐색 (최대 1000개 상태만)
    const queue: PuzzleState[] = [{
      pieces: originalState,
      moves: [],
      hash: originalHash
    }];
    
    let visitedCount = 0;
    const maxVisits = 1000; // 더 작은 제한
    const maxDepth = 10; // 더 작은 깊이 제한
    
    while (queue.length > 0 && visitedCount < maxVisits) {
      const currentState = queue.shift()!;
      visitedCount++;
      
      // 너무 깊은 상태는 건너뛰기
      if (currentState.moves.length >= maxDepth) continue;
      
      // 가능한 모든 이동 찾기
      const possibleMoves = this.getPossibleMoves(currentState.pieces);
      
      for (const move of possibleMoves) {
        // 이동 적용
        const newPieces = this.applyMove(currentState.pieces, move);
        const newHash = this.getStateHash(newPieces);
        
        // 이미 방문한 상태인지 확인
        if (this.solvedStates.has(newHash)) continue;
        
        // 새로운 상태 저장
        const newMoves = [...currentState.moves, move];
        this.solvedStates.set(newHash, newMoves);
        
        // 큐에 추가
        queue.push({
          pieces: newPieces,
          moves: newMoves,
          hash: newHash
        });
      }
    }
    
    console.log(`🧠 Learned ${this.solvedStates.size} possible states from reverse moves`);
  }
  
  // 현재 상태에 대한 해결 경로 찾기
  public findSolutionPath(currentPieces: PuzzlePiece[]): PuzzleMove[] | null {
    const currentHash = this.getStateHash(currentPieces);
    
    if (this.solvedStates.has(currentHash)) {
      const reverseMoves = this.solvedStates.get(currentHash)!;
      // 역방향 이동을 정방향으로 변환
      return this.reverseMoves(reverseMoves);
    }
    
    return null;
  }
  
  // 역방향 이동을 정방향으로 변환
  private reverseMoves(reverseMoves: PuzzleMove[]): PuzzleMove[] {
    return reverseMoves.map(move => ({
      pieceId: move.pieceId,
      direction: this.reverseDirection(move.direction),
      fromPosition: move.toPosition,
      toPosition: move.fromPosition
    })).reverse();
  }
  
  // 방향 역전
  private reverseDirection(direction: 'up' | 'down' | 'left' | 'right'): 'up' | 'down' | 'left' | 'right' {
    switch (direction) {
      case 'up': return 'down';
      case 'down': return 'up';
      case 'left': return 'right';
      case 'right': return 'left';
    }
  }
  
  // 가능한 모든 이동 찾기
  public getPossibleMoves(pieces: PuzzlePiece[]): PuzzleMove[] {
    const moves: PuzzleMove[] = [];
    const emptyPiece = pieces.find(p => p.isEmpty);
    if (!emptyPiece) return moves;
    
    const config = getConfigByTotalPieces(pieces.length);
    const emptyRow = emptyPiece.currentRow;
    const emptyCol = emptyPiece.currentCol;
    
    // 상하좌우 인접한 조각들 찾기
    const directions = [
      { row: -1, col: 0, name: 'up' },
      { row: 1, col: 0, name: 'down' },
      { row: 0, col: -1, name: 'left' },
      { row: 0, col: 1, name: 'right' }
    ];
    
    for (const dir of directions) {
      const newRow = emptyRow + dir.row;
      const newCol = emptyCol + dir.col;
      
      if (newRow >= 0 && newRow < config.rows && newCol >= 0 && newCol < config.cols) {
        const targetPosition = newRow * config.cols + newCol;
        const targetPiece = pieces.find(p => p.currentPosition === targetPosition);
        
        if (targetPiece && !targetPiece.isEmpty) {
          moves.push({
            pieceId: targetPiece.id,
            direction: dir.name as 'up' | 'down' | 'left' | 'right',
            fromPosition: targetPiece.currentPosition,
            toPosition: emptyPiece.currentPosition
          });
        }
      }
    }
    
    return moves;
  }
  
  // 이동 적용
  public applyMove(pieces: PuzzlePiece[], move: PuzzleMove): PuzzlePiece[] {
    const newPieces = pieces.map(p => ({ ...p }));
    const targetPiece = newPieces.find(p => p.id === move.pieceId);
    const emptyPiece = newPieces.find(p => p.isEmpty);
    
    if (!targetPiece || !emptyPiece) return pieces;
    
    // 위치 교환
    const tempPosition = targetPiece.currentPosition;
    const tempRow = targetPiece.currentRow;
    const tempCol = targetPiece.currentCol;
    
    targetPiece.currentPosition = emptyPiece.currentPosition;
    targetPiece.currentRow = emptyPiece.currentRow;
    targetPiece.currentCol = emptyPiece.currentCol;
    
    emptyPiece.currentPosition = tempPosition;
    emptyPiece.currentRow = tempRow;
    emptyPiece.currentCol = tempCol;
    
    return newPieces;
  }
}

// 전역 역방향 학습기 인스턴스
const reverseLearner = new ReversePuzzleLearner();

// 역방향 학습 초기화 함수
export const initializeReverseLearning = (): void => {
  console.log('🧠 Initializing reverse puzzle learning...');
  reverseLearner.learnAllPossibleStates();
};

// 역방향 학습을 사용한 해결 경로 찾기
export const solvePuzzleWithReverseLearning = (pieces: PuzzlePiece[]): PuzzleMove[] => {
  console.log('🧠 Using reverse learning to find solution...');
  console.log('📊 Current pieces state:', pieces.map(p => ({
    id: p.id,
    currentPosition: p.currentPosition,
    correctPosition: p.correctPosition,
    isEmpty: p.isEmpty
  })));
  
  const solution = reverseLearner.findSolutionPath(pieces);
  
  if (solution && solution.length > 0) {
    console.log(`🎯 Found solution with ${solution.length} moves using reverse learning`);
    return solution;
  } else {
    console.log('❌ No solution found with reverse learning, falling back to A*');
    return solvePuzzle(pieces);
  }
};

// 현재 퍼즐 크기에 맞는 셔플 함수 (원본으로 돌아갈 수 있는 루트 보장)
export const shuffleWithLearnedRoute = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
  console.log('🎲 Shuffling with current puzzle size to ensure solvability...');
  
  // 현재 퍼즐의 크기 정보 가져오기
  const config = getConfigByTotalPieces(pieces.length);
  console.log(`🎯 Shuffling ${config.rows}x${config.cols} puzzle with ${pieces.length} pieces`);
  
  // 현재 상태에서 랜덤하게 조각들끼리 위치 교환
  let shuffled = [...pieces];
  const shuffleCount = Math.floor(Math.random() * 100) + 50; // 50-150번 교환
  
  for (let i = 0; i < shuffleCount; i++) {
    const randomIndex1 = Math.floor(Math.random() * shuffled.length);
    const randomIndex2 = Math.floor(Math.random() * shuffled.length);
    
    if (randomIndex1 !== randomIndex2) {
      // 위치 교환
      const temp = shuffled[randomIndex1];
      shuffled[randomIndex1] = shuffled[randomIndex2];
      shuffled[randomIndex2] = temp;
      
      // 좌표 업데이트
      const tempRow = shuffled[randomIndex1].currentRow;
      const tempCol = shuffled[randomIndex1].currentCol;
      const tempPosition = shuffled[randomIndex1].currentPosition;
      
      shuffled[randomIndex1].currentRow = shuffled[randomIndex2].currentRow;
      shuffled[randomIndex1].currentCol = shuffled[randomIndex2].currentCol;
      shuffled[randomIndex1].currentPosition = shuffled[randomIndex2].currentPosition;
      
      shuffled[randomIndex2].currentRow = tempRow;
      shuffled[randomIndex2].currentCol = tempCol;
      shuffled[randomIndex2].currentPosition = tempPosition;
    }
  }
  
  console.log(`🎲 Successfully shuffled with ${shuffleCount} random swaps`);
  console.log('✅ Generated state maintains original puzzle size');
  
  return shuffled;
}; 

// 원본 사진 상태에서 기준칸을 움직여 섞을 수 있는 모든 경우의 수를 학습하는 시스템
interface OriginalStateMove {
  pieceId: number;
  direction: 'up' | 'down' | 'left' | 'right';
  fromPosition: number;
  toPosition: number;
}

interface OriginalStatePath {
  moves: OriginalStateMove[];
  finalState: string;
}

class OriginalStateLearner {
  private learnedPaths: Map<string, OriginalStatePath[]> = new Map();
  private maxDepth: number = 15; // 최대 학습 깊이
  private maxPathsPerState: number = 10; // 상태당 최대 경로 수

  // 원본 상태 생성 (1,2,3 / 4,5,6 / 7,8,9 순서)
  public createOriginalState(level: number): PuzzlePiece[] {
    const config = getConfigByTotalPieces(level === 1 ? 9 : level === 2 ? 16 : 25);
    const pieces: PuzzlePiece[] = [];
    
    for (let i = 0; i < config.totalPieces; i++) {
      const row = Math.floor(i / config.cols);
      const col = i % config.cols;
      
      pieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
        currentRow: row,
        currentCol: col,
        correctRow: row,
        correctCol: col,
        isEmpty: false
      });
    }
    
    return pieces;
  }

  // 상태 해시 생성
  private getStateHash(pieces: PuzzlePiece[]): string {
    return pieces.map(p => `${p.currentPosition}`).join(',');
  }

  // 기준칸(9번째 칸) 찾기
  private findReferencePiece(pieces: PuzzlePiece[]): PuzzlePiece | null {
    return pieces.find(p => p.correctPosition === 8) || null;
  }

  // 기준칸과 인접한 조각들 찾기
  private getAdjacentToReference(pieces: PuzzlePiece[]): PuzzlePiece[] {
    const referencePiece = this.findReferencePiece(pieces);
    if (!referencePiece) return [];

    return pieces.filter(p => 
      p.id !== referencePiece.id && (
        (Math.abs(p.currentRow - referencePiece.currentRow) === 1 && p.currentCol === referencePiece.currentCol) || // 위/아래로 인접
        (Math.abs(p.currentCol - referencePiece.currentCol) === 1 && p.currentRow === referencePiece.currentRow)    // 좌/우로 인접
      )
    );
  }

  // 기준칸과 인접한 조각 교환
  private swapWithReference(pieces: PuzzlePiece[], adjacentPiece: PuzzlePiece): PuzzlePiece[] {
    const referencePiece = this.findReferencePiece(pieces);
    if (!referencePiece) return pieces;

    const newPieces = pieces.map(p => ({ ...p }));
    const targetPiece = newPieces.find(p => p.id === adjacentPiece.id)!;
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

    return newPieces;
  }

  // 이동 방향 계산
  public getDirectionFromReferenceToTarget(referencePiece: PuzzlePiece, targetPiece: PuzzlePiece): 'up' | 'down' | 'left' | 'right' | null {
    const rowDiff = targetPiece.currentRow - referencePiece.currentRow;
    const colDiff = targetPiece.currentCol - referencePiece.currentCol;
    
    if (rowDiff === -1) return 'up';
    if (rowDiff === 1) return 'down';
    if (colDiff === -1) return 'left';
    if (colDiff === 1) return 'right';
    
    return null;
  }

  // 모든 가능한 상태 학습
  public learnAllPossibleStates(level: number): void {
    console.log('🧠 Learning all possible states from original state...');
    
    const originalPieces = this.createOriginalState(level);
    const originalHash = this.getStateHash(originalPieces);
    
    // BFS로 모든 가능한 상태 탐색
    const queue: { pieces: PuzzlePiece[]; path: OriginalStateMove[] }[] = [
      { pieces: originalPieces, path: [] }
    ];
    
    const visited = new Set<string>();
    visited.add(originalHash);
    
    while (queue.length > 0) {
      const { pieces, path } = queue.shift()!;
      const currentHash = this.getStateHash(pieces);
      
      // 현재 상태의 경로 저장
      if (!this.learnedPaths.has(currentHash)) {
        this.learnedPaths.set(currentHash, []);
      }
      
      const existingPaths = this.learnedPaths.get(currentHash)!;
      if (existingPaths.length < this.maxPathsPerState) {
        existingPaths.push({
          moves: [...path],
          finalState: currentHash
        });
      }
      
      // 최대 깊이에 도달하면 중단
      if (path.length >= this.maxDepth) continue;
      
      // 기준칸과 인접한 모든 조각들과 교환
      const adjacentPieces = this.getAdjacentToReference(pieces);
      
      for (const adjacentPiece of adjacentPieces) {
        const newPieces = this.swapWithReference(pieces, adjacentPiece);
        const newHash = this.getStateHash(newPieces);
        
        if (!visited.has(newHash)) {
          visited.add(newHash);
          
          const referencePiece = this.findReferencePiece(pieces);
          const direction = referencePiece ? this.getDirectionFromReferenceToTarget(referencePiece, adjacentPiece) : null;
          
          if (direction) {
            const newMove: OriginalStateMove = {
              pieceId: adjacentPiece.id,
              direction: direction,
              fromPosition: adjacentPiece.currentPosition,
              toPosition: referencePiece!.currentPosition
            };
            
            queue.push({
              pieces: newPieces,
              path: [...path, newMove]
            });
          }
        }
      }
    }
    
    console.log(`✅ Learned ${this.learnedPaths.size} unique states with ${Array.from(this.learnedPaths.values()).reduce((sum, paths) => sum + paths.length, 0)} total paths`);
  }

  // 현재 상태에서 원본 상태로 가는 경로 찾기
  public findPathToOriginal(currentPieces: PuzzlePiece[]): OriginalStateMove[] | null {
    const currentHash = this.getStateHash(currentPieces);
    const paths = this.learnedPaths.get(currentHash);
    
    if (!paths || paths.length === 0) {
      console.log('❌ No learned path found for current state');
      return null;
    }
    
    // 가장 짧은 경로 선택
    const shortestPath = paths.reduce((shortest, current) => 
      current.moves.length < shortest.moves.length ? current : shortest
    );
    
    console.log(`🎯 Found path to original with ${shortestPath.moves.length} moves`);
    return shortestPath.moves;
  }

  // 다음 최적 이동 찾기 (기준칸 방향 기준)
  public getNextOptimalMove(currentPieces: PuzzlePiece[]): OriginalStateMove | null {
    const path = this.findPathToOriginal(currentPieces);
    
    if (!path || path.length === 0) {
      console.log('❌ No optimal move found');
      return null;
    }
    
    const nextMove = path[0];
    console.log(`💡 Next optimal move: Piece ${nextMove.pieceId} ${nextMove.direction}`);
    return nextMove;
  }

  // 기준칸 방향 기준으로 힌트 제공
  public getHintByReferenceDirection(currentPieces: PuzzlePiece[]): { targetPiece: PuzzlePiece; direction: string } | null {
    const referencePiece = this.findReferencePiece(currentPieces);
    if (!referencePiece) {
      console.log('❌ Reference piece not found');
      return null;
    }

    // 기준칸과 인접한 조각들 찾기
    const adjacentPieces = this.getAdjacentToReference(currentPieces);
    if (adjacentPieces.length === 0) {
      console.log('❌ No adjacent pieces to reference');
      return null;
    }

    // 원본 상태로 가는 경로 찾기
    const path = this.findPathToOriginal(currentPieces);
    if (!path || path.length === 0) {
      console.log('❌ No path to original state found');
      return null;
    }

    // 첫 번째 이동에서 기준칸이 이동할 방향 계산
    const firstMove = path[0];
    const targetPiece = currentPieces.find(p => p.id === firstMove.pieceId);
    
    if (!targetPiece) {
      console.log('❌ Target piece not found');
      return null;
    }

    // 기준칸에서 타겟 조각으로의 방향 계산
    const direction = this.getDirectionFromReferenceToTarget(referencePiece, targetPiece);
    
    if (!direction) {
      console.log('❌ Direction calculation failed');
      return null;
    }

    console.log(`💡 Hint by reference direction: Reference piece should move ${direction} to swap with piece ${targetPiece.id}`);
    
    return {
      targetPiece: targetPiece,
      direction: direction
    };
  }
}

// 전역 학습기 인스턴스
let originalStateLearner: OriginalStateLearner | null = null;

// 학습 초기화
export const initializeOriginalStateLearning = (level: number): void => {
  console.log(`🧠 Initializing original state learning for level ${level}...`);
  originalStateLearner = new OriginalStateLearner();
  originalStateLearner.learnAllPossibleStates(level);
  console.log('✅ Original state learning completed');
};

// 힌트 제공
export const getOriginalStateHint = (pieces: PuzzlePiece[]): OriginalStateMove | null => {
  if (!originalStateLearner) {
    console.log('❌ Original state learner not initialized');
    return null;
  }
  
  return originalStateLearner.getNextOptimalMove(pieces);
};

// 기준칸 방향 기준 힌트 제공
export const getReferenceDirectionHint = (pieces: PuzzlePiece[]): { targetPiece: PuzzlePiece; direction: string } | null => {
  if (!originalStateLearner) {
    console.log('❌ Original state learner not initialized');
    return null;
  }
  
  return originalStateLearner.getHintByReferenceDirection(pieces);
};

// 기준칸의 원본 상태로 돌아가는 전체 경로 힌트 제공
export const getReferencePathHint = (pieces: PuzzlePiece[]): { 
  nextMove: { targetPiece: PuzzlePiece; direction: string };
  totalSteps: number;
  pathDescription: string;
} | null => {
  if (!originalStateLearner) {
    console.log('❌ Original state learner not initialized');
    return null;
  }
  
  // 기준칸 찾기
  const referencePiece = pieces.find(p => p.correctPosition === 8);
  if (!referencePiece) {
    console.log('❌ Reference piece not found');
    return null;
  }
  
  // 원본 상태로 가는 경로 찾기
  const path = originalStateLearner.findPathToOriginal(pieces);
  if (!path || path.length === 0) {
    console.log('❌ No path to original state found');
    return null;
  }
  
  // 첫 번째 이동 정보
  const firstMove = path[0];
  const targetPiece = pieces.find(p => p.id === firstMove.pieceId);
  
  if (!targetPiece) {
    console.log('❌ Target piece not found');
    return null;
  }
  
  // 기준칸에서 타겟 조각으로의 방향 계산
  const direction = originalStateLearner.getDirectionFromReferenceToTarget(referencePiece, targetPiece);
  
  if (!direction) {
    console.log('❌ Direction calculation failed');
    return null;
  }
  
  // 경로 설명 생성
  const pathDescription = generatePathDescription(path, referencePiece);
  
  console.log(`💡 Reference path hint: ${pathDescription}`);
  console.log(`🎯 Next move: Reference piece should move ${direction} to swap with piece ${targetPiece.id + 1}`);
  console.log(`📊 Total steps to original: ${path.length}`);
  
  return {
    nextMove: {
      targetPiece: targetPiece,
      direction: direction
    },
    totalSteps: path.length,
    pathDescription: pathDescription
  };
};

// 경로 설명 생성 함수
const generatePathDescription = (path: OriginalStateMove[], referencePiece: PuzzlePiece): string => {
  if (path.length === 0) return '이미 원본 상태입니다';
  
  const stepDescriptions = path.map((move, index) => {
    const direction = getDirectionName(move.direction);
    return `${index + 1}단계: ${direction}`;
  });
  
  const totalSteps = path.length;
  const currentPosition = referencePiece.currentPosition + 1;
  const targetPosition = 9; // 원본에서 기준칸의 위치
  
  return `기준칸(현재 ${currentPosition}번 위치)이 ${targetPosition}번 위치로 돌아가기 위해 ${totalSteps}단계 이동이 필요합니다. ${stepDescriptions.slice(0, 3).join(' → ')}${totalSteps > 3 ? '...' : ''}`;
};

// 방향 이름 변환
const getDirectionName = (direction: string): string => {
  switch (direction) {
    case 'up': return '위로';
    case 'down': return '아래로';
    case 'left': return '왼쪽으로';
    case 'right': return '오른쪽으로';
    default: return direction;
  }
};

// 9번 조각을 움직여서 원본 사진을 맞출 수 있도록 섞기
export const shuffleWithReferenceMovements = (pieces: PuzzlePiece[], level: number): PuzzlePiece[] => {
  console.log('🔀 Starting shuffle with 9th piece (reference piece) movements...');
  
  // 현재 퍼즐 상태를 복사
  let shuffled = pieces.map(p => ({ ...p }));
  
  // 9번 조각(기준칸/빈칸) 찾기
  const referencePiece = shuffled.find(p => p.correctPosition === 8);
  if (!referencePiece) {
    console.log('❌ Reference piece (9th piece) not found');
    return shuffled;
  }
  
  console.log(`🎯 Reference piece found at position: ${referencePiece.currentPosition + 1}`);
  
  // 더 효과적인 섞기를 위한 이동 패턴
  const movePatterns = [
    'random', 'spiral', 'zigzag', 'circular'
  ];
  
  const maxMoves = 50; // 더 많은 이동으로 확실한 섞기
  console.log(`🔄 Starting ${maxMoves} moves with reference piece`);
  
  for (let i = 0; i < maxMoves; i++) {
    // 현재 기준칸의 위치
    const refRow = referencePiece.currentRow;
    const refCol = referencePiece.currentCol;
    
    // 기준칸과 인접한 조각들 찾기 (상하좌우)
    const adjacentPieces = shuffled.filter(p => 
      p.id !== referencePiece.id && (
        (Math.abs(p.currentRow - refRow) === 1 && p.currentCol === refCol) || // 위/아래로 인접
        (Math.abs(p.currentCol - refCol) === 1 && p.currentRow === refRow)    // 좌/우로 인접
      )
    );
    
    if (adjacentPieces.length === 0) {
      console.log('❌ No adjacent pieces to reference piece');
      break;
    }
    
    // 다양한 이동 패턴 적용
    let selectedAdjacent: PuzzlePiece;
    const pattern = movePatterns[i % movePatterns.length];
    
    switch (pattern) {
      case 'spiral':
        // 나선형 패턴: 위 -> 오른쪽 -> 아래 -> 왼쪽 순서로 우선순위
        const directions = [
          { row: refRow - 1, col: refCol }, // 위
          { row: refRow, col: refCol + 1 }, // 오른쪽
          { row: refRow + 1, col: refCol }, // 아래
          { row: refRow, col: refCol - 1 }  // 왼쪽
        ];
        
        selectedAdjacent = adjacentPieces.find(p => 
          directions.some(dir => p.currentRow === dir.row && p.currentCol === dir.col)
        ) || adjacentPieces[0];
        break;
        
      case 'zigzag':
        // 지그재그 패턴: 대각선 방향 우선
        selectedAdjacent = adjacentPieces.find(p => 
          Math.abs(p.currentRow - refRow) === 1 && Math.abs(p.currentCol - refCol) === 1
        ) || adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
        break;
        
      case 'circular':
        // 원형 패턴: 기준칸을 중심으로 원을 그리며 이동
        const centerRow = Math.floor(level === 1 ? 3 : level === 2 ? 4 : 5) / 2;
        const centerCol = Math.floor(level === 1 ? 3 : level === 2 ? 4 : 5) / 2;
        
        selectedAdjacent = adjacentPieces.find(p => {
          const distanceFromCenter = Math.sqrt(
            Math.pow(p.currentRow - centerRow, 2) + Math.pow(p.currentCol - centerCol, 2)
          );
          return distanceFromCenter > Math.sqrt(
            Math.pow(refRow - centerRow, 2) + Math.pow(refCol - centerCol, 2)
          );
        }) || adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
        break;
        
      default: // random
        selectedAdjacent = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
    }
    
    // 기준칸과 선택된 인접 조각의 위치 교환
    const tempPosition = referencePiece.currentPosition;
    const tempRow = referencePiece.currentRow;
    const tempCol = referencePiece.currentCol;
    
    referencePiece.currentPosition = selectedAdjacent.currentPosition;
    referencePiece.currentRow = selectedAdjacent.currentRow;
    referencePiece.currentCol = selectedAdjacent.currentCol;
    
    selectedAdjacent.currentPosition = tempPosition;
    selectedAdjacent.currentRow = tempRow;
    selectedAdjacent.currentCol = tempCol;
    
    console.log(`🔄 Move ${i + 1} (${pattern}): Reference piece swapped with piece ${selectedAdjacent.id + 1}`);
  }
  
  // 섞인 상태가 원본과 충분히 다른지 확인
  const originalPositions = pieces.map(p => p.currentPosition);
  const shuffledPositions = shuffled.map(p => p.currentPosition);
  const differentPositions = originalPositions.filter((pos, index) => pos !== shuffledPositions[index]);
  
  console.log(`📊 Shuffle result: ${differentPositions.length}/${pieces.length} pieces moved`);
  
  // 만약 충분히 섞이지 않았다면 추가 이동
  if (differentPositions.length < pieces.length * 0.3) {
    console.log('⚠️ Not enough shuffling, adding more moves...');
    
    for (let i = 0; i < 20; i++) {
      const refPiece = shuffled.find(p => p.correctPosition === 8);
      if (!refPiece) break;
      
      const adjacentPieces = shuffled.filter(p => 
        p.id !== refPiece.id && (
          (Math.abs(p.currentRow - refPiece.currentRow) === 1 && p.currentCol === refPiece.currentCol) ||
          (Math.abs(p.currentCol - refPiece.currentCol) === 1 && p.currentRow === refPiece.currentRow)
        )
      );
      
      if (adjacentPieces.length > 0) {
        const randomAdjacent = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
        
        const tempPosition = refPiece.currentPosition;
        const tempRow = refPiece.currentRow;
        const tempCol = refPiece.currentCol;
        
        refPiece.currentPosition = randomAdjacent.currentPosition;
        refPiece.currentRow = randomAdjacent.currentRow;
        refPiece.currentCol = randomAdjacent.currentCol;
        
        randomAdjacent.currentPosition = tempPosition;
        randomAdjacent.currentRow = tempRow;
        randomAdjacent.currentCol = tempCol;
      }
    }
  }
  
  console.log('✅ Puzzle shuffled successfully with reference piece movements');
  return shuffled;
}; 