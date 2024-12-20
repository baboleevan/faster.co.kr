# Faster.co.kr

Fast.com과 유사한 인터넷 속도 측정 웹사이트

## 기능

- 실시간 다운로드/업로드 속도 측정
- 진행 상황 표시
- 모바일 친화적인 반응형 디자인

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- Node.js

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 도커 실행

```bash
# 도커 이미지 빌드
docker build -t faster.co.kr .

# 도커 컨테이너 실행
docker run -p 3000:3000 faster.co.kr
```

## 라이선스

MIT License 
