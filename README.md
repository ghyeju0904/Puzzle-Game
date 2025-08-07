# Puzzle Web3 App

퍼즐 게임과 Web3 기능을 결합한 React 애플리케이션입니다.

## 🚀 배포 방법

### Vercel 배포 (권장)

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **Vercel 로그인**
   ```bash
   vercel login
   ```

3. **프로젝트 배포**
   ```bash
   vercel
   ```

4. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

### 수동 배포

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **빌드**
   ```bash
   npm run build
   ```

3. **Vercel 대시보드에서 배포**
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 연결
   - 자동 배포 설정

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 16+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build

# 테스트
npm test
```

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── GameResult.tsx
│   ├── GameStats.tsx
│   ├── GameTimer.tsx
│   ├── ImageUpload.tsx
│   ├── PuzzleBoard.tsx
│   └── WalletConnect.tsx
├── hooks/              # 커스텀 훅
│   ├── useSound.ts
│   └── useWeb3.ts
├── services/           # 서비스 로직
│   └── web3Service.ts
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── utils/              # 유틸리티 함수
│   └── puzzleUtils.ts
└── App.tsx            # 메인 앱 컴포넌트
```

## 🔧 주요 기능

- 🧩 퍼즐 게임 (3x3, 4x4, 5x5)
- 🎵 사운드 효과
- 💰 Web3 지갑 연결
- 🎯 자동 해결 기능
- 💡 힌트 시스템
- 📊 게임 통계

## 🌐 환경 변수

프로덕션 환경에서 필요한 환경 변수:

```env
REACT_APP_WEB3_PROVIDER_URL=your_web3_provider_url
REACT_APP_CONTRACT_ADDRESS=your_contract_address
```

## 📝 배포 노트

- Vercel은 자동으로 `vercel.json` 설정을 사용합니다
- SPA 라우팅을 위해 모든 경로가 `index.html`로 리다이렉트됩니다
- 정적 파일은 캐싱 최적화가 적용됩니다

## 🐛 문제 해결

### 빌드 오류
```bash
# 캐시 클리어
npm run build -- --reset-cache
```

### 의존성 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 📄 라이선스

MIT License
