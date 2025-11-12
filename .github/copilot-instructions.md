<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# WallyLog - Next.js Markdown Blog

이 프로젝트는 Next.js와 Tailwind CSS를 사용한 마크다운 기반 블로그입니다.

## 프로젝트 구조

-   `/posts/` - 마크다운 블로그 포스트 파일들
-   `/src/lib/posts.ts` - 마크다운 파일 처리 유틸리티
-   `/src/app/` - Next.js App Router 페이지들
-   `/src/app/posts/[slug]/page.tsx` - 개별 포스트 페이지

## 사용 기술

-   **Next.js 15** - App Router 사용
-   **TypeScript** - 타입 안전성
-   **Tailwind CSS** - 스타일링
-   **gray-matter** - 마크다운 front matter 파싱
-   **remark** & **remark-html** - 마크다운을 HTML로 변환

## 개발 가이드라인

1. 모든 새로운 기능은 TypeScript로 작성
2. Tailwind CSS 클래스를 사용하여 스타일링
3. 마크다운 파일은 `/posts/` 디렉토리에 저장
4. 컴포넌트는 재사용 가능하도록 설계
5. 반응형 디자인 고려

## 마크다운 포스트 구조

```markdown
---
title: "포스트 제목"
date: "YYYY-MM-DD"
category: "카테고리"
---

# 포스트 내용
```
