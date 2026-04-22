/**
 * 首页 banner 装饰 SVG 描边入场（anime.js svg.createDrawable）
 * 在 #site-info 的 #site-subtitle 下面注入一条手绘风格的分隔曲线，
 * 页面加载时沿路径自描自绘出现
 */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.iife.min.js';

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

  // 一条微波浪线：像手写签名下方的分隔符
  var SVG_MARKUP =
    '<svg class="sd-flourish" viewBox="0 0 320 30" aria-hidden="true">' +
      '<path class="sd-path" d="M 6 18 ' +
        'C 40 4, 70 32, 110 16 ' +
        'S 180 4, 220 18 ' +
        'S 290 28, 314 12" ' +
        'fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" />' +
      '<circle class="sd-dot" cx="314" cy="12" r="2.5" fill="currentColor" />' +
    '</svg>';

  function ensureFlourish() {
    var siteInfo = document.querySelector('#page-header #site-info');
    if (!siteInfo) return null;

    var existing = siteInfo.querySelector('.sd-flourish');
    if (existing) return existing;

    var wrap = document.createElement('div');
    wrap.className = 'sd-flourish-wrap';
    wrap.innerHTML = SVG_MARKUP;

    var anchor = siteInfo.querySelector('#site-subtitle');
    if (anchor && anchor.nextSibling) {
      siteInfo.insertBefore(wrap, anchor.nextSibling);
    } else if (anchor) {
      siteInfo.appendChild(wrap);
    } else {
      siteInfo.appendChild(wrap);
    }
    return wrap.querySelector('.sd-flourish');
  }

  function run() {
    var svg = ensureFlourish();
    if (!svg) return;
    if (svg.dataset.sdDrawn) return;

    if (reduceMotion) {
      svg.dataset.sdDrawn = '1';
      svg.classList.add('sd-ready');
      return;
    }

    loadAnime()
      .then(function (anime) {
        svg.dataset.sdDrawn = '1';
        svg.classList.add('sd-ready');

        var path = svg.querySelector('.sd-path');
        var dot = svg.querySelector('.sd-dot');
        if (!path) return;

        // 优先走 anime v4 的 createDrawable（会自动处理 pathLength）
        var drawable = null;
        try {
          if (anime.svg && typeof anime.svg.createDrawable === 'function') {
            drawable = anime.svg.createDrawable(path);
          }
        } catch (e) { drawable = null; }

        if (drawable) {
          anime.animate(drawable, {
            draw: ['0 0', '0 1'],
            duration: 850,
            ease: 'out(3)',
            delay: 150,
          });
        } else {
          // 回退：手工用 strokeDasharray + strokeDashoffset
          var len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          anime.animate(path, {
            strokeDashoffset: [{ from: len, to: 0 }],
            duration: 850,
            ease: 'out(3)',
            delay: 150,
          });
        }

        if (dot) {
          anime.animate(dot, {
            opacity: [{ from: 0, to: 1 }],
            scale: [{ from: 0, to: 1 }],
            duration: 380,
            ease: 'spring(1, 110, 14, 0)',
            delay: 950,
          });
        }
      })
      .catch(function () {
        svg.classList.add('sd-ready');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  document.addEventListener('pjax:complete', run);
})();
