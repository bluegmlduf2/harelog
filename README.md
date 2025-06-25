# 🐰 HareLog - Next.js Markdown Blog

Next.js와 Tailwind CSS를 사용한 마크다운 기반 블로그입니다.

## ✨ 특징

-   📝 **마크다운 지원** - 마크다운으로 쉽게 글 작성
-   🚀 **빠른 성능** - Next.js 15의 App Router와 정적 생성 기능 활용
-   🎨 **모던한 디자인** - Tailwind CSS로 만든 깔끔하고 반응형 UI
-   🏷️ **태그 시스템** - 포스트를 태그로 분류
-   ⚡ **TypeScript** - 타입 안전성과 개발 생산성

## 🛠️ 사용 기술

-   **Next.js 15** - React 기반 풀스택 프레임워크
-   **TypeScript** - 정적 타입 체크
-   **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
-   **gray-matter** - 마크다운 front matter 파싱
-   **remark** & **remark-html** - 마크다운을 HTML로 변환

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 새 포스트 작성

`/posts/` 디렉토리에 마크다운 파일을 생성하세요:

```markdown
---
title: "새로운 포스트"
date: "2024-12-01"
tags: "태그"
---

# 포스트 내용

여기에 마크다운으로 내용을 작성하세요.
```

## 📁 프로젝트 구조

```
harelog/
├── posts/                    # 마크다운 포스트 파일들
│   ├── hello-world.md
│   ├── nextjs-blog-tutorial.md
│   └── tailwind-css-tips.md
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── posts/[slug]/     # 동적 포스트 페이지
│   │   └── page.tsx          # 홈페이지
│   └── lib/
│       └── posts.ts          # 마크다운 처리 유틸리티
├── .github/
│   └── copilot-instructions.md
└── package.json
```

## 🎨 커스터마이징

### 스타일링

Tailwind CSS 클래스를 사용하여 스타일을 커스터마이징할 수 있습니다.

### 포스트 메타데이터

각 마크다운 파일의 front matter에서 다음 필드를 지원합니다:

-   `title`: 포스트 제목
-   `date`: 발행 날짜 (YYYY-MM-DD)
-   `tags`: 태그 (문자열)

## 📦 빌드 및 배포

### 빌드

```bash
npm run build
```

### 로컬에서 프로덕션 버전 실행

```bash
npm start
```

### Vercel에 배포

가장 쉬운 방법은 [Vercel Platform](https://vercel.com/new)을 사용하는 것입니다.

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

💡 **팁**: 새로운 포스트를 추가한 후에는 개발 서버를 재시작해야 할 수 있습니다.
