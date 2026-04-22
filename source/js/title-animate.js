/**
 * 标题逐字入场动画
 * 作用范围：#page-header #site-title（首页/归档等大标题） + #post-info .post-title（文章页标题）
 * 依赖：anime.js v4（按需 CDN 加载）
 * 兼容：Butterfly pjax（监听 pjax:complete 重新触发）
 */
(function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.iife.min.js';
  var SELECTOR = '#page-header #site-title, #post-info .post-title';
  var CLASS_READY = 'ta-ready';
  var CLASS_CHAR = 'ta-char';

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

  // 按 grapheme（尽量贴合视觉字符，含 emoji/CJK）拆分
  function graphemes(text) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      var seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      var out = [];
      var it = seg.segment(text);
      for (var s of it) out.push(s.segment);
      return out;
    }
    return Array.from(text);
  }

  // 只替换元素内的第一个文本节点，保留同级的 .post-edit-link 等元素
  function splitFirstTextNode(el) {
    var firstText = null;
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue && n.nodeValue.trim().length > 0) {
        firstText = n;
        break;
      }
    }
    if (!firstText) return [];

    var chars = graphemes(firstText.nodeValue);
    var frag = document.createDocumentFragment();
    var wrappers = [];
    chars.forEach(function (ch) {
      if (ch === '\n') {
        frag.appendChild(document.createTextNode(ch));
        return;
      }
      var span = document.createElement('span');
      span.className = CLASS_CHAR;
      span.textContent = ch;
      if (ch === ' ' || ch === '\u00A0') {
        // 空格保留可换行，但不参与动画（避免出现 inline-block 空格撑高）
        frag.appendChild(document.createTextNode(ch));
        return;
      }
      frag.appendChild(span);
      wrappers.push(span);
    });
    el.replaceChild(frag, firstText);
    return wrappers;
  }

  function animateOne(anime, el) {
    if (el.dataset.taDone) return;
    el.dataset.taDone = '1';

    var chars = splitFirstTextNode(el);
    el.classList.add(CLASS_READY);

    if (!chars.length) return;

    anime.animate(chars, {
      y: [{ from: '0.5em', to: '0em' }],
      opacity: [{ from: 0, to: 1 }],
      rotate: [{ from: -6, to: 0 }],
      duration: 550,
      ease: 'spring(1, 130, 16, 0)',
      delay: anime.stagger(22),
    });

    // 淡入同容器里的其他元素（比如文章标题旁边的铅笔编辑链接）
    var siblings = el.querySelectorAll(':scope > :not(.' + CLASS_CHAR + ')');
    if (siblings.length) {
      anime.animate(siblings, {
        opacity: [{ from: 0, to: 1 }],
        duration: 280,
        delay: 100 + chars.length * 22,
        ease: 'out(2)',
      });
    }
  }

  function run() {
    var els = document.querySelectorAll(SELECTOR);
    if (!els.length) return;

    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add(CLASS_READY); });
      return;
    }

    loadAnime()
      .then(function (anime) {
        if (!anime || !anime.animate) {
          els.forEach(function (el) { el.classList.add(CLASS_READY); });
          return;
        }
        els.forEach(function (el) { animateOne(anime, el); });
      })
      .catch(function () {
        els.forEach(function (el) { el.classList.add(CLASS_READY); });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Butterfly pjax：切页后标题是新的 DOM，需要重新触发
  document.addEventListener('pjax:complete', run);
})();
