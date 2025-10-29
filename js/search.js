// 검색 기능
console.log("검색 모듈이 로드되었습니다.");

class SearchManager {
  constructor() {
    this.searchIndex = [];
    this.isInitialized = false;
  }

  async init(posts) {
    console.log("검색 인덱스 구축 중...");
    this.buildSearchIndex(posts);
    this.isInitialized = true;
    console.log(`검색 인덱스 구축 완료: ${this.searchIndex.length}개 항목`);
  }

  buildSearchIndex(posts) {
    this.searchIndex = posts.map((post) => ({
      id: post.file,
      title: post.title.toLowerCase(),
      excerpt: post.excerpt.toLowerCase(),
      tags: post.tags.map((tag) => tag.toLowerCase()),
      category: (post.category || "").toLowerCase(),
      content: post.excerpt.toLowerCase(), // 실제 구현에서는 전체 내용을 인덱싱할 수 있음
    }));
  }

  search(query, posts) {
    if (!this.isInitialized) {
      console.warn("검색 인덱스가 초기화되지 않았습니다.");
      return posts;
    }

    if (!query.trim()) {
      return posts;
    }

    const searchTerm = query.toLowerCase().trim();
    console.log("검색어:", searchTerm);

    const results = posts.filter((post) => {
      const postIndex = this.searchIndex.find((item) => item.id === post.file);
      if (!postIndex) return false;

      return (
        postIndex.title.includes(searchTerm) ||
        postIndex.excerpt.includes(searchTerm) ||
        postIndex.tags.some((tag) => tag.includes(searchTerm)) ||
        postIndex.category.includes(searchTerm)
      );
    });

    console.log(`검색 결과: ${results.length}개 게시글`);
    return results;
  }

  // 고급 검색 (여러 키워드, 태그 필터링 등)
  advancedSearch(query, posts, options = {}) {
    if (!query.trim() && !options.tags?.length) {
      return posts;
    }

    let results = [...posts];

    // 텍스트 검색
    if (query.trim()) {
      results = this.search(query, results);
    }

    // 태그 필터링
    if (options.tags?.length) {
      results = results.filter((post) =>
        options.tags.every((tag) => post.tags.includes(tag))
      );
    }

    // 카테고리 필터링
    if (options.category) {
      results = results.filter((post) => post.category === options.category);
    }

    // 날짜 범위 필터링
    if (options.dateFrom || options.dateTo) {
      results = results.filter((post) => {
        const postDate = new Date(post.date);
        if (options.dateFrom && postDate < new Date(options.dateFrom))
          return false;
        if (options.dateTo && postDate > new Date(options.dateTo)) return false;
        return true;
      });
    }

    return results;
  }

  // 검색어 하이라이팅
  highlightSearchTerm(text, searchTerm) {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, "gi");
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // 검색 제안 (자동완성)
  getSuggestions(query, posts) {
    if (!query.trim() || query.length < 2) return [];

    const suggestions = new Set();
    const searchTerm = query.toLowerCase();

    posts.forEach((post) => {
      // 제목에서 제안
      if (post.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(post.title);
      }

      // 태그에서 제안
      post.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag);
        }
      });

      // 카테고리에서 제안
      if (post.category && post.category.toLowerCase().includes(searchTerm)) {
        suggestions.add(post.category);
      }
    });

    return Array.from(suggestions).slice(0, 5); // 최대 5개 제안
  }
}

// 전역 검색 매니저 인스턴스
window.searchManager = new SearchManager();
