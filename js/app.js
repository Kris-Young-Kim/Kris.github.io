// 메인 애플리케이션 로직
console.log("블로그 애플리케이션이 시작되었습니다.");

class BlogApp {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.currentFilter = null;
    this.init();
  }

  async init() {
    console.log("블로그 데이터를 로딩 중...");
    await this.loadPosts();
    this.renderPosts();
    this.renderTagFilters();
    this.setupEventListeners();
    console.log(`${this.posts.length}개의 게시글이 로드되었습니다.`);
  }

  async loadPosts() {
    try {
      const response = await fetch("posts.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.posts = await response.json();
      this.filteredPosts = [...this.posts];
      console.log("posts.json 로드 성공:", this.posts.length, "개 게시글");
    } catch (error) {
      console.error("posts.json 로드 실패:", error);
      this.showError(
        "게시글을 불러올 수 없습니다. posts.json 파일을 확인해주세요."
      );
    }
  }

  renderPosts() {
    const postsGrid = document.getElementById("posts-grid");
    const noPosts = document.getElementById("no-posts");

    if (!postsGrid) {
      console.error("posts-grid 요소를 찾을 수 없습니다.");
      return;
    }

    if (this.filteredPosts.length === 0) {
      postsGrid.style.display = "none";
      noPosts.style.display = "block";
      return;
    }

    postsGrid.style.display = "grid";
    noPosts.style.display = "none";

    postsGrid.innerHTML = this.filteredPosts
      .map((post) => this.createPostCard(post))
      .join("");
  }

  createPostCard(post) {
    const tagsHtml = post.tags
      .map(
        (tag) => `<span class="post-card-tag">${this.escapeHtml(tag)}</span>`
      )
      .join("");

    return `
      <a href="post.html?file=${encodeURIComponent(
        post.file
      )}" class="post-card">
        <h3 class="post-card-title">${this.escapeHtml(post.title)}</h3>
        <p class="post-card-excerpt">${this.escapeHtml(post.excerpt)}</p>
        <div class="post-card-meta">
          <div class="post-card-tags">${tagsHtml}</div>
          <time>${post.date}</time>
        </div>
      </a>
    `;
  }

  renderTagFilters() {
    const tagFilters = document.getElementById("tag-filters");
    if (!tagFilters) return;

    // 모든 태그 수집
    const allTags = new Set();
    this.posts.forEach((post) => {
      post.tags.forEach((tag) => allTags.add(tag));
    });

    const tagsArray = Array.from(allTags).sort();

    tagFilters.innerHTML = tagsArray
      .map(
        (tag) =>
          `<button class="tag-filter" data-tag="${this.escapeHtml(
            tag
          )}">${this.escapeHtml(tag)}</button>`
      )
      .join("");
  }

  setupEventListeners() {
    // 검색 기능
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput?.value || "";
        this.handleSearch(query);
      });
    }

    // 태그 필터
    const tagFilters = document.getElementById("tag-filters");
    if (tagFilters) {
      tagFilters.addEventListener("click", (e) => {
        if (e.target.classList.contains("tag-filter")) {
          const tag = e.target.dataset.tag;
          this.handleTagFilter(tag);
        }
      });
    }

    // Enter 키로 검색
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSearch(e.target.value);
        }
      });
    }
  }

  handleSearch(query) {
    console.log("검색 쿼리:", query);

    if (!query.trim()) {
      this.filteredPosts = [...this.posts];
    } else {
      const searchTerm = query.toLowerCase();
      this.filteredPosts = this.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          (post.category && post.category.toLowerCase().includes(searchTerm))
      );
    }

    // 태그 필터 초기화
    this.clearTagFilters();
    this.renderPosts();
    console.log(`검색 결과: ${this.filteredPosts.length}개 게시글`);
  }

  handleTagFilter(tag) {
    console.log("태그 필터:", tag);

    // 태그 필터 토글
    if (this.currentFilter === tag) {
      this.currentFilter = null;
      this.filteredPosts = [...this.posts];
    } else {
      this.currentFilter = tag;
      this.filteredPosts = this.posts.filter((post) => post.tags.includes(tag));
    }

    this.updateTagFilterUI();
    this.renderPosts();
    console.log(`태그 필터 결과: ${this.filteredPosts.length}개 게시글`);
  }

  updateTagFilterUI() {
    const tagFilters = document.querySelectorAll(".tag-filter");
    tagFilters.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.tag === this.currentFilter) {
        btn.classList.add("active");
      }
    });
  }

  clearTagFilters() {
    this.currentFilter = null;
    const tagFilters = document.querySelectorAll(".tag-filter");
    tagFilters.forEach((btn) => btn.classList.remove("active"));
  }

  showError(message) {
    const postsGrid = document.getElementById("posts-grid");
    const noPosts = document.getElementById("no-posts");

    if (postsGrid) postsGrid.style.display = "none";
    if (noPosts) {
      noPosts.style.display = "block";
      noPosts.innerHTML = `<p>❌ ${message}</p>`;
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// DOM이 로드되면 애플리케이션 시작
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 로드 완료, 블로그 애플리케이션 초기화 중...");
  new BlogApp();
});
