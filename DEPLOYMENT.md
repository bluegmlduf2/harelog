# 🚀 Vercel 배포 가이드

## 1. GitHub 저장소 생성

1. GitHub에 새 저장소 생성
2. 로컬 프로젝트를 GitHub에 푸시:

```bash
git init
git add .
git commit -m "Initial commit: HareLog blog"
git branch -M main
git remote add origin https://github.com/your-username/harelog.git
git push -u origin main
```

## 2. Vercel에 배포

### 방법 1: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: Vercel 웹사이트 사용

1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택
5. 자동 빌드 및 배포

## 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

### 필수 환경 변수

-   `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app`
-   `ADMIN_PASSWORD`: 관리자 비밀번호
-   `JWT_SECRET`: JWT 서명을 위한 비밀키

### GitHub 저장 기능 사용시 (선택사항)

-   `USE_GITHUB_STORAGE`: `true`
-   `GITHUB_TOKEN`: GitHub Personal Access Token
-   `GITHUB_REPOSITORY`: `your-username/your-repo`
-   `GITHUB_BRANCH`: `main`
-   `GIT_USER_NAME`: `"HareLog Bot"`
-   `GIT_USER_EMAIL`: `"bot@harelog.com"`

### AI 기능 사용시 (선택사항)

-   `OPENROUTER_API_KEY`: OpenRouter API 키

## 4. 자동 배포 설정

-   `main` 브랜치에 푸시할 때마다 자동 배포
-   Pull Request 생성 시 프리뷰 배포

## 5. 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 설정 → Domains
2. 도메인 추가
3. DNS 설정 업데이트

## 📝 배포 후 확인사항

-   [ ] 홈페이지 로딩 확인
-   [ ] 개별 포스트 페이지 확인
-   [ ] 이미지 로딩 확인 (`/storage/` 경로)
-   [ ] 파비콘 표시 확인
-   [ ] 웹 에디터 접근 확인 (`/admin`)
-   [ ] 관리자 로그인 기능 확인
-   [ ] 포스트 작성/수정 기능 확인 (GitHub 저장 설정시)
-   [ ] 이미지 업로드 기능 확인

## 🎯 성능 최적화

이 프로젝트는 이미 다음과 같이 최적화되어 있습니다:

-   ✅ Next.js 15 App Router 사용
-   ✅ TypeScript로 타입 안전성 확보
-   ✅ Tailwind CSS로 최적화된 스타일링
-   ✅ 마크다운 정적 생성
-   ✅ 이미지 최적화 및 GitHub 저장
-   ✅ 웹 에디터를 통한 편리한 포스트 관리
-   ✅ JWT 기반 인증 시스템
