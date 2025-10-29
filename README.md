# GitHub Pages 정적 블로그

GitHub Pages를 이용한 정적 블로그입니다. 마크다운으로 글을 작성하고 GitHub Actions를 통해 자동으로 배포됩니다.

## 🚀 주요 기능

- ✅ **마크다운 지원**: `.md` 파일로 쉽게 글 작성
- ✅ **다크/라이트 모드**: 사용자 선호에 따른 테마 전환
- ✅ **검색 기능**: 게시글 제목, 내용, 태그로 검색
- ✅ **태그 필터링**: 태그별 게시글 필터링
- ✅ **댓글 시스템**: Giscus를 통한 GitHub Discussions 연동
- ✅ **코드 하이라이팅**: Prism.js를 통한 코드 문법 강조
- ✅ **반응형 디자인**: 모바일/데스크톱 최적화
- ✅ **자동 배포**: GitHub Actions를 통한 자동 배포

## 📁 프로젝트 구조

```
/
├── .nojekyll                 # Jekyll 비활성화 (필수!)
├── index.html               # 메인 페이지 (게시글 목록)
├── post.html                 # 게시글 상세 페이지
├── css/
│   ├── style.css            # 메인 스타일 (다크/라이트 모드)
│   └── prism.css            # 코드 하이라이팅 테마
├── js/
│   ├── app.js               # 메인 애플리케이션 로직
│   ├── post-loader.js       # 마크다운 로딩 및 파싱
│   ├── search.js            # 검색 기능
│   └── theme.js            # 다크/라이트 모드 토글
├── pages/                   # 마크다운 게시글 폴더
│   └── example.md
├── .github/
│   ├── workflows/
│   │   └── deploy.yml       # GitHub Pages 배포
│   └── scripts/
│       └── generate-posts.js # posts.json 생성 스크립트
└── posts.json               # 게시글 메타데이터 (자동 생성)
```

## 🛠️ 배포 방법

### 1단계: GitHub 저장소 생성

1. GitHub에서 새 저장소 생성
2. 저장소 이름을 `{your_username}.github.io`로 설정
3. 이 프로젝트 파일들을 저장소에 업로드

### 2단계: GitHub Pages 설정

1. 저장소 **Settings** → **Pages** 이동
2. **Source**를 "GitHub Actions"로 설정
3. **Actions** 탭에서 워크플로우가 실행되는지 확인

### 3단계: Giscus 댓글 설정 (선택사항)

1. 저장소 **Settings** → **General** → **Features**에서 **Discussions** 활성화
2. [Giscus 앱](https://github.com/apps/giscus) 설치
3. [Giscus 설정 페이지](https://giscus.app/ko)에서 설정 정보 복사
4. `js/post-loader.js` 파일의 Giscus 설정 부분 수정

### 4단계: 게시글 작성

1. `pages/` 폴더에 `.md` 파일 추가
2. Front Matter 형식으로 메타데이터 작성:

```markdown
---
title: "글 제목"
date: 2025-01-29
tags: ["태그1", "태그2"]
category: "카테고리"
description: "글 설명"
---

# 글 내용

여기에 마크다운으로 글을 작성합니다.
```

3. 변경사항을 커밋하고 푸시
4. GitHub Actions가 자동으로 배포 실행

## 📝 글 작성 가이드

### Front Matter 필드

- `title`: 글 제목 (필수)
- `date`: 작성 날짜 (YYYY-MM-DD 형식)
- `tags`: 태그 배열 (선택사항)
- `category`: 카테고리 (선택사항)
- `description`: 글 설명 (선택사항)

### 마크다운 문법

일반적인 마크다운 문법을 모두 지원합니다:

- **제목**: `#`, `##`, `###` 등
- **강조**: `**굵게**`, `*기울임*`
- **코드**: `` `인라인 코드` ``, `코드 블록`
- **링크**: `[텍스트](URL)`
- **이미지**: `![alt](이미지URL)`
- **목록**: `-` 또는 `1.`

## 🎨 커스터마이징

### 색상 테마 수정

`css/style.css` 파일의 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
  --bg-color: #ffffff; /* 배경색 */
  --text-color: #333333; /* 텍스트 색상 */
  --accent-color: #0366d6; /* 강조 색상 */
  /* ... */
}
```

### 레이아웃 수정

`index.html`과 `post.html` 파일을 수정하여 레이아웃을 변경할 수 있습니다.

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS 변수, Grid, Flexbox
- **JavaScript (ES6+)**: 모듈화된 코드 구조
- **marked.js**: 마크다운 파싱
- **Prism.js**: 코드 하이라이팅
- **Giscus**: 댓글 시스템
- **GitHub Actions**: CI/CD

## 📚 참고 자료

- [GitHub Pages 공식 문서](https://pages.github.com/)
- [marked.js 문서](https://marked.js.org/)
- [Prism.js 문서](https://prismjs.com/)
- [Giscus 설정 가이드](https://giscus.app/)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**즐거운 블로깅 되세요!** 🎉
