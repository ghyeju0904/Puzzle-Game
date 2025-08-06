export interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  isEmpty: boolean;
}

export interface GameState {
  isPlaying: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  currentLevel: number;
  timeLeft: number;
  moves: number;
  startTime: number | null;
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  isConnecting: boolean;
}

export interface SoundEffects {
  click: any;
  cheer: any;
  meow: any;
}

export interface PuzzleConfig {
  level: number;
  rows: number;
  cols: number;
  totalPieces: number;
  timeLimit: number;
}

export interface LeaderboardEntry {
  address: string;
  time: number;
  level: number;
  moves: number;
  timestamp: number;
}

// React 관련 타입 정의
export interface ReactElement {
  type: string | Function;
  props: any;
  key?: string | number;
}

export interface ReactNode {
  children?: ReactNode;
  [key: string]: any;
}

// Framer Motion 타입 정의
export interface MotionProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  className?: string;
  style?: any;
  onClick?: () => void;
  children?: ReactNode;
}

// Window 객체 확장
declare global {
  interface Window {
    ethereum?: any;
  }
} 