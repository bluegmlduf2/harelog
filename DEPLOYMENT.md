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

Vercel 대시보드에서 다음 환경 변수 설정:

-   `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app`

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
-   [ ] RSS 피드 확인 (`/feed`)
-   [ ] Sitemap 확인 (`/sitemap.xml`)
-   [ ] Robots.txt 확인 (`/robots.txt`)

## 🎯 성능 최적화

이 프로젝트는 이미 다음과 같이 최적화되어 있습니다:

-   ✅ 정적 사이트 생성 (SSG)
-   ✅ 이미지 최적화
-   ✅ SEO 메타데이터
-   ✅ PWA 매니페스트
-   ✅ RSS 피드
-   ✅ Sitemap 자동 생성
