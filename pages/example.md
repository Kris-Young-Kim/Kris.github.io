---
title: "GitHub Pages 블로그 시작하기"
date: 2025-01-29
tags: ["GitHub", "블로그", "정적사이트"]
category: "Tutorial"
description: "GitHub Pages를 이용한 정적 블로그 구축 방법을 소개합니다."
---

# GitHub Pages 블로그 시작하기

안녕하세요! 이 글은 GitHub Pages를 이용해서 정적 블로그를 구축하는 방법에 대해 설명합니다.

## 🚀 주요 특징

이 블로그는 다음과 같은 특징을 가지고 있습니다:

- **정적 사이트**: HTML, CSS, JavaScript만으로 구성
- **마크다운 지원**: `.md` 파일로 쉽게 글 작성
- **다크/라이트 모드**: 사용자 선호에 따른 테마 전환
- **검색 기능**: 게시글 제목, 내용, 태그로 검색 가능
- **댓글 시스템**: Giscus를 통한 GitHub Discussions 연동
- **자동 배포**: GitHub Actions를 통한 자동 배포

## 📝 글 작성 방법

새로운 글을 작성하려면 `pages/` 폴더에 마크다운 파일을 추가하면 됩니다.

### Front Matter 예시

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

## 🎨 스타일링

이 블로그는 CSS 변수를 사용해서 다크/라이트 모드를 지원합니다.

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  /* 라이트 모드 색상 */
}

[data-theme="dark"] {
  --bg-color: #0d1117;
  --text-color: #c9d1d9;
  /* 다크 모드 색상 */
}
```

## 🔧 기술 스택

- **마크다운 파싱**: marked.js
- **코드 하이라이팅**: Prism.js
- **댓글 시스템**: Giscus
- **배포**: GitHub Actions
- **호스팅**: GitHub Pages

## 📚 더 알아보기

더 자세한 내용은 다음 링크들을 참고하세요:

- [GitHub Pages 공식 문서](https://pages.github.com/)
- [marked.js 문서](https://marked.js.org/)
- [Giscus 설정 가이드](https://giscus.app/)

---

이제 여러분만의 블로그를 시작해보세요! 🎉
