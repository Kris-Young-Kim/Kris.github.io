// 게시글 로더 및 마크다운 파싱
console.log("게시글 로더가 초기화되었습니다.");

class PostLoader {
  constructor() {
    this.currentPost = null;
    this.init();
  }

  async init() {
    console.log("게시글 페이지 초기화 중...");
    await this.loadPostFromURL();
    this.setupGiscus();
  }

  async loadPostFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get("file");

    if (!fileName) {
      console.error("파일명이 URL에 없습니다.");
      this.showError("게시글 파일을 찾을 수 없습니다.");
      return;
    }

    console.log("로딩할 파일:", fileName);
    await this.loadPost(fileName);
  }

  async loadPost(fileName) {
    try {
      console.log(`게시글 로딩 중: ${fileName}`);

      // posts.json에서 메타데이터 가져오기
      const postsResponse = await fetch("posts.json");
      if (!postsResponse.ok) {
        throw new Error(`posts.json 로드 실패: ${postsResponse.status}`);
      }

      const posts = await postsResponse.json();
      const postMeta = posts.find((post) => post.file === fileName);

      if (!postMeta) {
        throw new Error(`게시글 메타데이터를 찾을 수 없습니다: ${fileName}`);
      }

      console.log("게시글 메타데이터:", postMeta);

      // 마크다운 파일 로드
      const markdownResponse = await fetch(`pages/${fileName}`);
      if (!markdownResponse.ok) {
        throw new Error(`마크다운 파일 로드 실패: ${markdownResponse.status}`);
      }

      const markdownContent = await markdownResponse.text();
      console.log("마크다운 콘텐츠 길이:", markdownContent.length);

      // Front Matter 파싱 및 마크다운 변환
      const { content, metadata } = this.parseFrontMatter(markdownContent);
      const htmlContent = this.convertMarkdownToHtml(content);

      // 페이지 업데이트
      this.updatePage(postMeta, metadata, htmlContent);

      console.log("게시글 로드 완료");
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      this.showError(`게시글을 불러올 수 없습니다: ${error.message}`);
    }
  }

  parseFrontMatter(content) {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontMatterMatch) {
      console.log(
        "Front Matter가 없습니다. 전체 내용을 마크다운으로 처리합니다."
      );
      return { content, metadata: {} };
    }

    const frontMatter = frontMatterMatch[1];
    const markdownContent = frontMatterMatch[2];

    console.log("Front Matter 발견:", frontMatter);
    console.log("마크다운 콘텐츠 길이:", markdownContent.length);

    const metadata = {};
    const lines = frontMatter.split("\n");

    lines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === "tags" && value.startsWith("[") && value.endsWith("]")) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value
              .slice(1, -1)
              .split(",")
              .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ""));
          }
        }

        metadata[key] = value;
      }
    });

    console.log("파싱된 메타데이터:", metadata);
    return { content: markdownContent, metadata };
  }

  convertMarkdownToHtml(markdown) {
    console.log("마크다운을 HTML로 변환 중...");

    // marked.js 설정
    marked.setOptions({
      highlight: function (code, lang) {
        if (lang && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      },
      breaks: true,
      gfm: true,
    });

    const html = marked.parse(markdown);
    console.log("HTML 변환 완료, 길이:", html.length);
    return html;
  }

  updatePage(postMeta, metadata, htmlContent) {
    // 제목 업데이트
    const pageTitle = document.getElementById("post-title");
    const postTitleHeader = document.getElementById("post-title-header");
    const title = metadata.title || postMeta.title;

    if (pageTitle) {
      pageTitle.textContent = title;
      document.title = `${title} - GitHub Pages 블로그`;
    }

    if (postTitleHeader) {
      postTitleHeader.textContent = title;
    }

    // 날짜 업데이트
    const postDate = document.getElementById("post-date");
    if (postDate) {
      const date = metadata.date || postMeta.date;
      postDate.textContent = this.formatDate(date);
    }

    // 태그 업데이트
    const postTags = document.getElementById("post-tags");
    if (postTags && metadata.tags) {
      postTags.innerHTML = metadata.tags
        .map((tag) => `<span class="post-tag">${this.escapeHtml(tag)}</span>`)
        .join("");
    }

    // 카테고리 업데이트
    const postCategory = document.getElementById("post-category");
    if (postCategory && metadata.category) {
      postCategory.innerHTML = `<span class="post-category">${this.escapeHtml(
        metadata.category
      )}</span>`;
    }

    // 콘텐츠 업데이트
    const postContent = document.getElementById("post-content");
    if (postContent) {
      postContent.innerHTML = htmlContent;

      // 코드 하이라이팅 적용
      if (window.Prism) {
        Prism.highlightAll();
        console.log("코드 하이라이팅 적용 완료");
      }
    }

    this.currentPost = { ...postMeta, ...metadata };
    console.log("페이지 업데이트 완료");
  }

  setupGiscus() {
    console.log("Giscus 댓글 시스템 설정 중...");

    const commentsSection = document.getElementById("giscus-comments");
    if (!commentsSection) {
      console.warn("giscus-comments 요소를 찾을 수 없습니다.");
      return;
    }

    // Giscus 설정
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "kris-young-kim/kris-young-kim.github.io");
    script.setAttribute("data-repo-id", "YOUR_REPO_ID"); // 실제 repo-id로 변경 필요
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID"); // 실제 category-id로 변경 필요
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "1");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";

    // 스크립트 로드 에러 처리
    script.onerror = () => {
      console.error("Giscus 스크립트 로드 실패");
      commentsSection.innerHTML = `
        <div class="comments-loading">
          <p>❌ 댓글 시스템을 불러올 수 없습니다.</p>
          <p>GitHub Discussions가 활성화되어 있는지 확인해주세요.</p>
        </div>
      `;
    };

    // 스크립트 로드 성공 처리
    script.onload = () => {
      console.log("Giscus 스크립트 로드 완료");
    };

    commentsSection.appendChild(script);
    console.log("Giscus 설정 완료 - 저장소: kris-young-kim/kris-young-kim.github.io");
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("날짜 포맷팅 실패:", error);
      return dateString;
    }
  }

  showError(message) {
    const postContent = document.getElementById("post-content");
    if (postContent) {
      postContent.innerHTML = `
        <div class="error-message">
          <h2>❌ 오류</h2>
          <p>${this.escapeHtml(message)}</p>
          <a href="/" class="back-link">← 목록으로 돌아가기</a>
        </div>
      `;
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// DOM이 로드되면 게시글 로더 시작
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 로드 완료, 게시글 로더 초기화 중...");
  new PostLoader();
});
