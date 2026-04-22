/**
 * 作品集分类页标签筛选 + FLIP 平滑重排
 * 激活条件：URL 以 /categories/portfolio 开头
 * 数据源：/search.xml（Butterfly 的 local_search 已开启，包含每篇 post 的 tags）
 * 动画：anime.js + spring easing，用 FLIP（First-Last-Invert-Play）做平滑重排
 */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.iife.min.js';
  var SEARCH_XML = '/search.xml';
  var MAX_TAGS = 12;
  var ALL = '__all';

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isPortfolioCategory() {
    return /^\/categories\/portfolio(\/|$)/.test(location.pathname);
  }

  function loadAnime() {
    if (window.__animePromise) return window.__animePromise;
    window.__animePromise = new Promise(function (resolve, reject) {
      if (window.anime && window.anime.animate) return resolve(window.anime);
      var s = document.createElement('script');
      s.src = CDN;
      s.async = true;
      s.onload = function () { resolve(window.anime); };
      s.onerror = function (e) { reject(e); };
      document.head.appendChild(s);
    });
    return window.__animePromise;
  }

  var searchXmlPromise = null;
  function loadSearchXml() {
    if (searchXmlPromise) return searchXmlPromise;
    searchXmlPromise = fetch(SEARCH_XML)
      .then(function (r) { return r.text(); })
      .then(function (xml) {
        var doc = new DOMParser().parseFromString(xml, 'application/xml');
        var map = new Map();
        var entries = doc.querySelectorAll('entry');
        entries.forEach(function (entry) {
          var urlEl = entry.querySelector('url');
          if (!urlEl) return;
          var url = urlEl.textContent.trim();
          var tags = Array.prototype.slice
            .call(entry.querySelectorAll('tags > tag'))
            .map(function (t) { return t.textContent.trim(); });
          map.set(url, tags);
        });
        return map;
      })
      .catch(function () { return new Map(); });
    return searchXmlPromise;
  }

  function findContainer() {
    return document.querySelector('#category .article-sort');
  }

  function collectItems(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('.article-sort-item:not(.year)')
    );
  }

  function collectYears(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('.article-sort-item.year')
    );
  }

  function itemHref(el) {
    var link = el.querySelector('a[href*="/posts/"]');
    if (!link) return '';
    try {
      return new URL(link.getAttribute('href'), location.origin).pathname;
    } catch (e) { return link.getAttribute('href') || ''; }
  }

  function buildTagStats(items) {
    var count = new Map();
    items.forEach(function (el) {
      (el.__pfTags || []).forEach(function (t) {
        count.set(t, (count.get(t) || 0) + 1);
      });
    });
    return Array.prototype.slice
      .call(count.entries())
      .sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); });
  }

  function buildFilterBar(container, items, onPick) {
    var existing = container.parentNode.querySelector('.pf-filter');
    if (existing) existing.remove();

    var stats = buildTagStats(items).slice(0, MAX_TAGS);
    var bar = document.createElement('div');
    bar.className = 'pf-filter';

    var frag = document.createDocumentFragment();

    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'pf-chip pf-active';
    all.dataset.tag = ALL;
    all.innerHTML = '<span class="pf-label">全部</span><span class="pf-count">' +
      items.length + '</span>';
    frag.appendChild(all);

    stats.forEach(function (pair) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pf-chip';
      btn.dataset.tag = pair[0];
      btn.innerHTML =
        '<span class="pf-label">' + escapeHtml(pair[0]) + '</span>' +
        '<span class="pf-count">' + pair[1] + '</span>';
      frag.appendChild(btn);
    });

    bar.appendChild(frag);
    container.parentNode.insertBefore(bar, container);

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.pf-chip');
      if (!btn) return;
      var picked = bar.querySelector('.pf-chip.pf-active');
      if (picked) picked.classList.remove('pf-active');
      btn.classList.add('pf-active');
      onPick(btn.dataset.tag);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function computeVisibility(container, items, years, tag) {
    var shouldShow = new Map();
    items.forEach(function (el) {
      var match = tag === ALL || (el.__pfTags || []).indexOf(tag) >= 0;
      shouldShow.set(el, match);
    });

    // 判定每个 year 标签：它覆盖区间内只要有一个可见 item，就显示
    var children = Array.prototype.slice.call(container.children);
    var currentYear = null;
    years.forEach(function (y) { shouldShow.set(y, false); });
    children.forEach(function (el) {
      if (el.classList.contains('year')) {
        currentYear = el;
      } else if (currentYear && shouldShow.get(el)) {
        shouldShow.set(currentYear, true);
      }
    });
    return shouldShow;
  }

  function applyFilterAnimated(anime, container, items, years, tag) {
    var all = items.concat(years);
    var shouldShow = computeVisibility(container, items, years, tag);

    // === FLIP First：记录变化前位置 ===
    var before = new Map();
    all.forEach(function (el) {
      if (window.getComputedStyle(el).display !== 'none') {
        before.set(el, el.getBoundingClientRect());
      }
    });

    // === Apply：直接切换 display，完成目标布局 ===
    all.forEach(function (el) {
      if (shouldShow.get(el)) {
        el.style.display = '';
        el.classList.remove('pf-hidden');
      } else {
        el.style.display = 'none';
      }
    });

    // 强制布局一次
    void container.offsetHeight;

    // === FLIP Last：记录变化后位置 ===
    var after = new Map();
    all.forEach(function (el) {
      if (shouldShow.get(el)) {
        after.set(el, el.getBoundingClientRect());
      }
    });

    if (reduceMotion) return;

    // === Invert + Play ===
    all.forEach(function (el) {
      if (!shouldShow.get(el)) return;
      var b = before.get(el);
      var a = after.get(el);
      if (!a) return;

      if (!b) {
        // 新出现（之前被隐藏）：从下方淡入
        anime.animate(el, {
          opacity: [{ from: 0, to: 1 }],
          y: [{ from: 20, to: 0 }],
          scale: [{ from: 0.95, to: 1 }],
          duration: 380,
          ease: 'spring(1, 130, 16, 0)',
        });
      } else {
        var dx = b.left - a.left;
        var dy = b.top - a.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          anime.animate(el, {
            translateX: [{ from: dx, to: 0 }],
            translateY: [{ from: dy, to: 0 }],
            duration: 450,
            ease: 'spring(1, 125, 18, 0)',
          });
        }
      }
    });
  }

  function init() {
    if (!isPortfolioCategory()) return;

    var container = findContainer();
    if (!container || container.dataset.pfInited) return;

    var items = collectItems(container);
    var years = collectYears(container);
    if (items.length === 0) return;

    container.dataset.pfInited = '1';

    Promise.all([loadSearchXml(), loadAnime()])
      .then(function (res) {
        var urlToTags = res[0];
        var anime = res[1];
        if (!anime || !anime.animate) return;

        items.forEach(function (el) {
          el.__pfTags = urlToTags.get(itemHref(el)) || [];
        });

        buildFilterBar(container, items, function (tag) {
          applyFilterAnimated(anime, container, items, years, tag);
        });
      })
      .catch(function () { /* 静默失败，不影响正常浏览 */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('pjax:complete', init);
})();
