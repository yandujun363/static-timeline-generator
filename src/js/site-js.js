/**
 * 星光Kirarin 活动时间轴 — 交互脚本（原生 ES 模块，无第三方依赖）
 *
 * 功能：
 * - 主题切换（跟随系统 / 手动覆盖，localStorage 记忆）
 * - 分类筛选 + 关键词搜索，支持 URL 参数分享
 * - 时间轴左右交替重排、年份分组自动隐藏
 * - 锚点高亮、回到顶部
 */

const root = document.documentElement;
root.classList.remove('no-js');
root.classList.add('js');

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const THEME_KEY = 'kirarin-theme';

const readStoredTheme = () => {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const themeToggle = document.getElementById('theme-toggle');

const setTheme = (theme) => {
  root.dataset.theme = theme;
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
};

if (themeToggle) {
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);

    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* 忽略隐私模式下的写入失败 */
    }
  });

  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  media?.addEventListener('change', (event) => {
    if (!readStoredTheme()) {
      setTheme(event.matches ? 'dark' : 'light');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Filters & search                                                           */
/* -------------------------------------------------------------------------- */

const filterBar = document.querySelector('.filter-bar');
const timeline = document.querySelector('.timeline');

if (filterBar && timeline) {
  const chips = [...filterBar.querySelectorAll('[data-filter]')];
  const allChip = chips.find((chip) => chip.dataset.filter === 'all');
  const categoryChips = chips.filter((chip) => chip.dataset.filter !== 'all');
  const availableCategories = new Set(categoryChips.map((chip) => chip.dataset.filter));
  const entries = [...timeline.querySelectorAll('.timeline-entry')];
  const yearGroups = [...timeline.querySelectorAll('.year-group')];
  const searchInput = document.getElementById('timeline-search');
  const resultCount = document.getElementById('result-count');
  const emptyState = document.getElementById('empty-state');
  const clearButton = document.getElementById('clear-filters');

  const activeCategories = new Set();
  let query = '';

  const readUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    const categories = (params.get('cat') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter((value) => availableCategories.has(value));
    const search = (params.get('q') ?? '').trim();

    categories.forEach((category) => activeCategories.add(category));

    if (searchInput) {
      searchInput.value = search;
    }
    query = search.toLowerCase();
  };

  const syncUrl = () => {
    try {
      const url = new URL(window.location.href);

      if (activeCategories.size) {
        url.searchParams.set('cat', [...activeCategories].join(','));
      } else {
        url.searchParams.delete('cat');
      }

      if (query) {
        url.searchParams.set('q', searchInput?.value.trim() ?? query);
      } else {
        url.searchParams.delete('q');
      }

      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      /* file:// 等环境不支持 replaceState 时静默跳过 */
    }
  };

  const matches = (entry) => {
    if (activeCategories.size) {
      const categories = (entry.dataset.categories ?? '').split(',').filter(Boolean);
      if (!categories.some((category) => activeCategories.has(category))) {
        return false;
      }
    }

    return !query || (entry.dataset.search ?? '').includes(query);
  };

  const reflow = () => {
    let visibleIndex = 0;

    for (const entry of entries) {
      if (entry.hidden) continue;

      entry.classList.toggle('is-left', visibleIndex % 2 === 0);
      entry.classList.toggle('is-right', visibleIndex % 2 === 1);
      visibleIndex += 1;
    }
  };

  const update = () => {
    let visible = 0;

    for (const entry of entries) {
      const show = matches(entry);
      entry.hidden = !show;
      if (show) visible += 1;
    }

    for (const group of yearGroups) {
      group.hidden = !group.querySelector('.timeline-entry:not([hidden])');
    }

    reflow();

    if (resultCount) {
      resultCount.textContent =
        visible === entries.length
          ? `共 ${entries.length} 条事件`
          : `显示 ${visible} / ${entries.length} 条`;
    }

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }

    timeline.classList.toggle('is-empty', visible === 0);

    if (allChip) {
      const isAll = activeCategories.size === 0;
      allChip.classList.toggle('is-active', isAll);
      allChip.setAttribute('aria-pressed', String(isAll));
    }

    for (const chip of categoryChips) {
      const isActive = activeCategories.has(chip.dataset.filter);
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', String(isActive));
    }

    syncUrl();
  };

  const resetFilters = () => {
    activeCategories.clear();
    query = '';
    if (searchInput) searchInput.value = '';
    update();
  };

  allChip?.addEventListener('click', () => {
    activeCategories.clear();
    update();
  });

  for (const chip of categoryChips) {
    chip.addEventListener('click', () => {
      const category = chip.dataset.filter;

      if (activeCategories.has(category)) {
        activeCategories.delete(category);
      } else {
        activeCategories.add(category);
      }

      update();
    });
  }

  searchInput?.addEventListener('input', () => {
    query = searchInput.value.trim().toLowerCase();
    update();
  });

  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      searchInput.value = '';
      query = '';
      update();
      searchInput.blur();
    }
  });

  clearButton?.addEventListener('click', resetFilters);

  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;

    const target = event.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.matches('input, textarea, select') || target.isContentEditable);

    if (isTyping) return;

    event.preventDefault();
    searchInput?.focus();
  });

  readUrlState();
  update();
}

/* -------------------------------------------------------------------------- */
/* Hash highlight                                                            */
/* -------------------------------------------------------------------------- */

const highlightHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  if (!target || !target.classList.contains('timeline-entry')) return;

  if (target.hidden) {
    const clearButton = document.getElementById('clear-filters');
    clearButton?.click();
  }

  document.querySelectorAll('.timeline-entry.is-target').forEach((entry) => {
    entry.classList.remove('is-target');
  });
  target.classList.add('is-target');

  requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    });
  });
};

window.addEventListener('hashchange', highlightHash);
highlightHash();

/* -------------------------------------------------------------------------- */
/* Back to top                                                               */
/* -------------------------------------------------------------------------- */

const toTop = document.getElementById('to-top');
const hero = document.querySelector('.hero');

if (toTop && hero && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      toTop.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { rootMargin: '-72px 0px 0px' },
  );

  observer.observe(hero);

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}
