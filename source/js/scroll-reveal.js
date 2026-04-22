/**
 * 卡片滚动入场动画（anime.js onScroll + spring easing）
 * 作用范围：
 *   - 首页 .recent-post-item（文章卡片）
 *   - 分类/归档页 .article-sort-item（但不含 year 标签）
 *   - 侧边栏 .card-widget
 * 用 IntersectionObserver 触发，anime.js 做补间，spring 缓动
 */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.iife.min.js';

  var SELECTORS = [
    '.recent-post-item',
    '.article-sort-item:not(.year)',
    '.aside-content .card-widget',
  ].join(', ');

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function pickSpring(el) {
    // 侧边栏稍微弹一点，文章卡更稳
    if (el.classList.contains('card-widget')) {
      return 'spring(1, 160, 18, 0)';
    }
    return 'spring(1, 180, 20, 0)';
  }

  function prepare(el) {
    if (el.dataset.srPrepared) return;
    el.dataset.srPrepared = '1';
    // 记录原始位置、位移方向（左右侧交替）
    el.classList.add('sr-hidden');
  }

  function reveal(anime, el) {
    if (el.dataset.srRevealed) return;
    el.dataset.srRevealed = '1';
    el.classList.remove('sr-hidden');

    // 交错方向：卡片左右交替进入（更有节奏感）
    var fromX = 0;
    if (el.classList.contains('recent-post-item')) {
      // 首页卡片：奇偶交替
      var items = Array.prototype.slice.call(
        document.querySelectorAll('.recent-post-item')
      );
      var idx = items.indexOf(el);
      fromX = idx >= 0 && idx % 2 === 1 ? 24 : -24;
    }

    anime.animate(el, {
      x: fromX ? [{ from: fromX, to: 0 }] : undefined,
      y: [{ from: 24, to: 0 }],
      opacity: [{ from: 0, to: 1 }],
      scale: [{ from: 0.98, to: 1 }],
      duration: 380,
      ease: pickSpring(el),
    });
  }

  var observer = null;

  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function run() {
    destroy();

    var els = document.querySelectorAll(SELECTORS);
    if (!els.length) return;

    if (reduceMotion) {
      els.forEach(function (el) { el.classList.remove('sr-hidden'); });
      return;
    }

    els.forEach(prepare);

    loadAnime()
      .then(function (anime) {
        if (!anime || !anime.animate) {
          els.forEach(function (el) { el.classList.remove('sr-hidden'); });
          return;
        }

        observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                reveal(anime, entry.target);
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.08,
            rootMargin: '0px 0px -8% 0px',
          }
        );

        els.forEach(function (el) {
          // 初始就在视口里的直接立即动画（避免折叠上方卡片不动）
          var rect = el.getBoundingClientRect();
          var vh = window.innerHeight || document.documentElement.clientHeight;
          if (rect.top < vh && rect.bottom > 0) {
            reveal(anime, el);
          } else {
            observer.observe(el);
          }
        });
      })
      .catch(function () {
        els.forEach(function (el) { el.classList.remove('sr-hidden'); });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  document.addEventListener('pjax:complete', run);
})();
