// 다크/라이트 모드 테마 관리
console.log("테마 관리자가 로드되었습니다.");

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    console.log("테마 관리자 초기화 중...");
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    console.log(`현재 테마: ${this.currentTheme}`);
  }

  getStoredTheme() {
    try {
      return localStorage.getItem("blog-theme");
    } catch (error) {
      console.warn("로컬 스토리지에서 테마를 읽을 수 없습니다:", error);
      return null;
    }
  }

  getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  applyTheme(theme) {
    console.log(`테마 적용 중: ${theme}`);

    // HTML 요소에 테마 속성 설정
    document.documentElement.setAttribute("data-theme", theme);

    // 테마 토글 버튼 업데이트
    this.updateThemeToggle(theme);

    // 로컬 스토리지에 저장
    try {
      localStorage.setItem("blog-theme", theme);
    } catch (error) {
      console.warn("로컬 스토리지에 테마를 저장할 수 없습니다:", error);
    }

    this.currentTheme = theme;
    console.log(`테마 적용 완료: ${theme}`);
  }

  updateThemeToggle(theme) {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = themeToggle?.querySelector(".theme-icon");

    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
      );
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    console.log(`테마 전환: ${this.currentTheme} → ${newTheme}`);
    this.applyTheme(newTheme);
  }

  setupEventListeners() {
    const themeToggle = document.getElementById("theme-toggle");

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        console.log("테마 토글 버튼 클릭됨");
        this.toggleTheme();
      });
    }

    // 시스템 테마 변경 감지
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        // 저장된 테마가 없을 때만 시스템 테마를 따름
        if (!this.getStoredTheme()) {
          const systemTheme = e.matches ? "dark" : "light";
          console.log(`시스템 테마 변경 감지: ${systemTheme}`);
          this.applyTheme(systemTheme);
        }
      });
    }

    // 키보드 단축키 (Ctrl/Cmd + Shift + T)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        console.log("키보드 단축키로 테마 전환");
        this.toggleTheme();
      }
    });
  }

  // 테마별 추가 설정
  setupThemeSpecificFeatures() {
    // 다크 모드에서 이미지 밝기 조정
    if (this.currentTheme === "dark") {
      this.adjustImagesForDarkMode();
    }
  }

  adjustImagesForDarkMode() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      img.style.filter = "brightness(0.8) contrast(1.2)";
    });
  }

  // 테마 정보 가져오기
  getThemeInfo() {
    return {
      current: this.currentTheme,
      isDark: this.currentTheme === "dark",
      isLight: this.currentTheme === "light",
      systemTheme: this.getSystemTheme(),
      storedTheme: this.getStoredTheme(),
    };
  }

  // 프로그래밍 방식으로 테마 설정
  setTheme(theme) {
    if (theme === "dark" || theme === "light") {
      console.log(`테마 수동 설정: ${theme}`);
      this.applyTheme(theme);
    } else {
      console.warn("잘못된 테마 값:", theme);
    }
  }

  // 테마 설정 초기화 (시스템 테마로 복원)
  resetTheme() {
    console.log("테마 설정 초기화");
    try {
      localStorage.removeItem("blog-theme");
    } catch (error) {
      console.warn("로컬 스토리지에서 테마를 삭제할 수 없습니다:", error);
    }

    const systemTheme = this.getSystemTheme();
    this.applyTheme(systemTheme);
  }
}

// 전역 테마 매니저 인스턴스
window.themeManager = new ThemeManager();

// DOM이 로드되면 테마 관리자 초기화
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 로드 완료, 테마 관리자 초기화 중...");

  // 이미 초기화된 경우 다시 초기화하지 않음
  if (!window.themeManager) {
    window.themeManager = new ThemeManager();
  }
});
