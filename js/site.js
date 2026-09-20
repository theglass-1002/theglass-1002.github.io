/* ==========================================================================
   정유리 Portfolio — 공통 스크립트
   모바일 내비게이션 / 목차 스크롤스파이 / 앵커 이동
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     0. 언어 전환 — KO ⇄ EN (홈 + 모든 상세 페이지)

     한국어 원문이 기준이다. 번역 대상은 두 가지 방식으로 찾는다.
       - 홈: data-en / data-en-alt 속성이 붙은 요소
       - 상세: locales/*.en.js 의 사전 (원문 innerHTML → 영어) 으로 글 덩어리를 찾아 바꾼다
     원문은 처음 한 번 보관해 두고, 되돌릴 때 그대로 복원한다.

     언어 결정 우선순위: URL ?lang=  →  localStorage 'portfolio-lang'  →  ko
     ------------------------------------------------------------------ */
  var LANG_KEY = 'portfolio-lang';
  var lang = 'ko';
  var langListeners = [];
  (function initialLang() {
    var q = null;
    try { q = new URLSearchParams(window.location.search).get('lang'); } catch (e) { /* 무시 */ }
    if (q === 'en' || q === 'ko') {
      lang = q;
      try { localStorage.setItem(LANG_KEY, q); } catch (e) { /* 무시 */ }
      return;
    }
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'ko') lang = saved;
    } catch (e) { /* 저장소를 못 쓰면 한국어로 시작 */ }
  })();

  // 스크립트가 만드는 문구 (라이트박스 등)
  var UI = {
    ko: { zoom: '확대해서 보기', chart: '플로우차트', image: '이미지', dialog: '확대 보기', close: '닫기' },
    en: { zoom: 'view enlarged', chart: 'Flowchart', image: 'Image', dialog: 'Enlarged view', close: 'Close' }
  };
  function ui(key) { return UI[lang][key]; }

  var HANGUL = /[가-힣]/;
  var INLINE = { A: 1, STRONG: 1, EM: 1, CODE: 1, BR: 1, SPAN: 1, B: 1, I: 1, SMALL: 1, SUP: 1, SUB: 1, MARK: 1, KBD: 1, ABBR: 1, WBR: 1, U: 1, S: 1, TIME: 1, CITE: 1, Q: 1 };
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, SVG: 1, VIDEO: 1, IMG: 1, PICTURE: 1, IFRAME: 1, TEXTAREA: 1 };
  var TEXT_ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];
  var META_SEL = 'meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]';
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function inlineOnly(el) {
    for (var i = 0; i < el.children.length; i++) {
      var c = el.children[i];
      if (!INLINE[c.tagName] || !inlineOnly(c)) return false;
    }
    return true;
  }

  // 글 덩어리 = 안에 인라인 태그만 든 가장 바깥 요소. 목차처럼 li 안에 링크 하나뿐이면 링크 자체가 덩어리다.
  function collectUnits(root) {
    var units = [];
    (function walk(el) {
      if (SKIP[el.tagName.toUpperCase()] && el.tagName.toLowerCase() !== 'svg') return;
      if (el.matches && el.matches('[data-en], [data-lang-toggle], .lightbox, head')) return;
      if (el.tagName.toLowerCase() === 'svg') {
        Array.prototype.forEach.call(el.querySelectorAll('text, title, desc'), function (t) {
          if (HANGUL.test(t.textContent) && !t.querySelector('text, title, desc')) units.push(t);
        });
        return;
      }
      if (HANGUL.test(el.textContent) && inlineOnly(el)) {
        // 링크만 나열된 묶음(목차 li, 이전/다음 nav, 버튼 줄)은 링크 하나하나가 덩어리다
        var kids = Array.prototype.slice.call(el.children);
        var linksOnly = kids.length > 0 && kids.every(function (c) { return c.tagName === 'A'; }) &&
          Array.prototype.every.call(el.childNodes, function (n) { return n.nodeType !== 3 || !n.nodeValue.trim(); });
        if (linksOnly) { kids.forEach(function (c) { if (HANGUL.test(c.textContent)) units.push(c); }); return; }
        units.push(el);
        return;
      }
      Array.prototype.forEach.call(el.children, walk);
    })(root);
    return units;
  }

  function collectAttrs(root) {
    var out = [];
    Array.prototype.forEach.call(root.querySelectorAll('*'), function (el) {
      if (el.closest('[data-lang-toggle], [data-en-alt], .lightbox')) return;
      TEXT_ATTRS.forEach(function (a) {
        var v = el.getAttribute(a);
        if (v && HANGUL.test(v)) out.push({ el: el, attr: a, value: v });
      });
    });
    return out;
  }

  var i18n = { items: [], dict: {}, ready: false };

  // 한국어 글자가 사전에 없어 한국어로 남은 곳 — 개발 중 ?i18n-debug 로 확인한다
  // (키는 번역을 적용하기 전에 저장해 둔 원문 기준이다)
  function report() {
    var missing = [];
    i18n.unitKeys.forEach(function (k) { if (!i18n.dict[k]) missing.push(k); });
    i18n.attrKeys.forEach(function (k) { if (!i18n.dict[k.value]) missing.push('[' + k.attr + '] ' + k.value); });
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = walker.nextNode())) {
      if (!HANGUL.test(n.nodeValue) || /^(SCRIPT|STYLE)$/.test(n.parentNode.tagName)) continue;
      if (n.parentNode.closest('[data-en], [data-lang-toggle], .lightbox, svg')) continue;
      if (!i18n.units.some(function (u) { return u.contains(n); })) missing.push('(unit 밖) ' + norm(n.nodeValue));
    }
    return missing;
  }

  (function language() {
    var toggle = document.querySelector('[data-lang-toggle]');
    var dict = {};
    [window.I18N_COMMON, window.I18N_PAGE].forEach(function (src) {
      if (!src) return;
      Object.keys(src).forEach(function (k) { dict[norm(k)] = src[k]; });
    });
    i18n.dict = dict;

    var items = [];   // { el, attr|null, ko, en }
    var titleKo = document.title;

    // 홈 방식: data-en / data-en-alt
    Array.prototype.forEach.call(document.querySelectorAll('[data-en]'), function (n) {
      n.setAttribute('data-ko', n.innerHTML);      // 홈 제목 스크립트가 원문을 다시 읽는다
      items.push({ el: n, attr: null, ko: n.innerHTML, en: n.getAttribute('data-en') });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-en-alt]'), function (n) {
      items.push({ el: n, attr: 'alt', ko: n.getAttribute('alt'), en: n.getAttribute('data-en-alt') });
    });

    // 상세 방식: 사전
    i18n.units = collectUnits(document.body);
    i18n.attrs = collectAttrs(document.body);
    i18n.units = i18n.units.filter(function (u) { return !u.closest('[data-en]'); });   // 홈 방식 요소와 겹치지 않게
    i18n.units.forEach(function (u) {
      var en = dict[norm(u.innerHTML)];
      if (en != null) items.push({ el: u, attr: null, ko: u.innerHTML, en: en });
    });
    i18n.attrs.forEach(function (a) {
      var en = dict[norm(a.value)];
      if (en != null) items.push({ el: a.el, attr: a.attr, ko: a.value, en: en });
    });
    Array.prototype.forEach.call(document.querySelectorAll(META_SEL), function (m) {
      var v = m.getAttribute('content');
      if (v && dict[norm(v)] != null) items.push({ el: m, attr: 'content', ko: v, en: dict[norm(v)] });
    });
    i18n.unitKeys = i18n.units.map(function (u) { return norm(u.innerHTML); });
    i18n.attrKeys = i18n.attrs.map(function (a) { return { attr: a.attr, value: norm(a.value) }; });
    i18n.items = items;
    i18n.ready = true;

    if (!items.length && !toggle) return;

    // 내부 링크에 현재 언어를 실어 보낸다 (저장소를 못 써도 유지되도록)
    function withLang(href, l) {
      var i = href.indexOf('#');
      var hash = i > -1 ? href.slice(i) : '';
      var path = i > -1 ? href.slice(0, i) : href;
      path = path.replace(/([?&])lang=(?:en|ko)(&|$)/, function (m, a, c) { return c === '&' ? a : ''; }).replace(/[?&]$/, '');
      if (l === 'en') path += (path.indexOf('?') > -1 ? '&' : '?') + 'lang=en';
      return path + hash;
    }
    function decorateLinks(l) {
      Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
        var h = a.getAttribute('href');
        if (!h || h.charAt(0) === '#' || /^[a-z][a-z0-9+.-]*:/i.test(h)) return;   // 앵커·외부·mailto·tel
        var path = h.split('#')[0].split('?')[0];
        if (path && !/\.html?$/.test(path) && path.slice(-1) !== '/') return;      // 이미지 같은 파일 제외
        a.setAttribute('href', withLang(h, l));
      });
    }

    function apply(next) {
      lang = next;
      document.documentElement.lang = next;
      document.title = next === 'en' && dict[norm(titleKo)] != null ? dict[norm(titleKo)] : titleKo;
      if (toggle) toggle.setAttribute('aria-checked', String(next === 'en'));
      items.forEach(function (it) {
        var val = next === 'en' ? it.en : it.ko;
        if (it.attr) it.el.setAttribute(it.attr, val);
        // 글자가 쪼개진 홈 제목은 intro 스크립트가 직접 다시 만든다
        else if (!it.el.hasAttribute('data-split')) it.el.innerHTML = val;
      });
      decorateLinks(next);
      langListeners.forEach(function (fn) { fn(next); });
      document.documentElement.classList.remove('i18n-pending');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = lang === 'en' ? 'ko' : 'en';
        apply(next);
        try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* 무시 */ }
        try {   // 새로고침 없이 주소창의 ?lang= 만 갱신 — 공유하면 같은 언어로 열린다
          var u = new URL(window.location.href);
          u.searchParams.set('lang', next);
          window.history.replaceState(window.history.state, '', u.toString());
        } catch (e) { /* 무시 */ }
      });
    }

    // 뒤로/앞으로 가기(bfcache)로 돌아왔을 때 다른 쪽에서 바꾼 언어를 따라간다
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      try {
        var saved = localStorage.getItem(LANG_KEY);
        if ((saved === 'en' || saved === 'ko') && saved !== lang) apply(saved);
      } catch (err) { /* 무시 */ }
    });

    if (lang === 'en') apply('en'); else document.documentElement.classList.remove('i18n-pending');
    if (/[?&]i18n-debug\b/.test(window.location.search)) {
      var miss = report();
      if (miss.length) console.warn('[i18n] 번역이 없는 글 ' + miss.length + '건\n' + miss.join('\n'));
    }
  })();

  // 개발용: 번역 대상을 뽑아 낸다 (브라우저 콘솔 / 검증 스크립트에서 사용)
  window.PortfolioI18n = {
    dump: function () {
      var seen = {};
      var entries = [];
      function add(k) { if (k && !seen[k]) { seen[k] = 1; entries.push(k); } }
      i18n.unitKeys.forEach(add);
      i18n.attrKeys.forEach(function (a) { add(a.value); });
      Array.prototype.forEach.call(document.querySelectorAll(META_SEL), function (m) {
        var k = norm(m.getAttribute('data-ko-content') || m.getAttribute('content') || '');
        if (HANGUL.test(k)) add(k);
      });
      return entries;
    },
    missing: report,
    lang: function () { return lang; }
  };

  /* ------------------------------------------------------------------
     1. 모바일 내비게이션
     ------------------------------------------------------------------ */
  (function navigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.setAttribute('data-open', String(open));
      if (open) {
        var first = nav.querySelector('a');
        if (first) first.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen(), true);
    });

    // 메뉴 안의 링크를 누르면 닫는다
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false, false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) setOpen(false, true);
    });

    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false, false);
    });

    // 데스크톱 폭으로 돌아오면 상태 초기화
    var wide = window.matchMedia('(min-width: 769px)');
    var onChange = function (e) { if (e.matches && isOpen()) setOpen(false, false); };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else if (wide.addListener) wide.addListener(onChange);
  })();

  /* ------------------------------------------------------------------
     2. 목차 스크롤스파이 (상세 페이지)
     ------------------------------------------------------------------ */
  (function tableOfContents() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var targets = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      (byId[id] = byId[id] || []).push(link);
      if (targets.indexOf(el) === -1) targets.push(el);
    });
    if (!targets.length) return;

    var current = null;
    function activate(id) {
      if (id === current) return;
      current = id;
      links.forEach(function (l) { l.removeAttribute('aria-current'); });
      (byId[id] || []).forEach(function (l) { l.setAttribute('aria-current', 'true'); });
    }

    var observer = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible.length) activate(visible[0].target.id);
    }, { rootMargin: '-88px 0px -70% 0px', threshold: 0 });

    targets.forEach(function (t) { observer.observe(t); });

    // 모바일 목차: 링크 선택 시 접기
    var mobileToc = document.querySelector('.toc-mobile');
    if (mobileToc) {
      mobileToc.addEventListener('click', function (e) {
        if (e.target.closest('a')) mobileToc.removeAttribute('open');
      });
    }
  })();

  /* ------------------------------------------------------------------
     3. 부드러운 앵커 이동 (헤더 높이 보정은 scroll-margin-top이 담당)
     ------------------------------------------------------------------ */
  if (!reduceMotion) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  /* ------------------------------------------------------------------
     4. 방문 통계 (GoatCounter)

     숫자는 페이지에 표시하지 않고 대시보드에서만 확인한다.
     아래 CODE 한 줄만 채우면 전 페이지에 적용된다.
       1) goatcounter.com 가입 → 사이트 코드 확인 (예: yuri-portfolio)
       2) CODE 에 그 코드를 넣는다
       3) 대시보드: https://<코드>.goatcounter.com

     회사별로 누가 열었는지 보려면 링크에 ?ref= 를 붙여서 보낸다.
       https://theglass-1002.github.io/?ref=카카오
     이러면 대시보드 Referrer 목록에 '카카오'가 시각과 함께 찍힌다.
     ------------------------------------------------------------------ */
  (function analytics() {
    var CODE = '';
    if (!CODE) return;

    // 로컬 작업 중에는 집계하지 않는다 (count.js도 자체적으로 걸러내지만 명시해 둔다)
    var host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '' || host === '::1') return;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + CODE + '.goatcounter.com/count');
    document.head.appendChild(s);
  })();

  /* ------------------------------------------------------------------
     5. 자동재생 영상

     - 모션을 줄이는 설정이면 재생하지 않고 poster만 보여준다.
     - 화면에 들어올 때만 재생한다. 스크롤로 지나간 영상이 계속 도는 것을
       막아 배터리와 데이터를 아낀다.
     ------------------------------------------------------------------ */
  (function autoplayVideos() {
    var videos = document.querySelectorAll('video[autoplay]');
    if (!videos.length) return;

    if (reduceMotion) {
      Array.prototype.forEach.call(videos, function (v) {
        v.autoplay = false;
        v.removeAttribute('autoplay');
        v.controls = true;
        v.pause();
      });
      return;
    }

    if (!('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { v.controls = true; });
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });

    Array.prototype.forEach.call(videos, function (v) { io.observe(v); });
  })();

  /* ------------------------------------------------------------------
     6. 이미지 확대 보기 (라이트박스)

     본문 figure 안의 사진과 플로우차트를 누르면 화면 가득 띄운다.
     홈 화면의 프로젝트 카드 이미지는 카드 전체가 링크라 제외한다.
     ------------------------------------------------------------------ */
  (function lightbox() {
    var triggers = document.querySelectorAll('figure img, .fig-diagram svg');
    if (!triggers.length) return;

    var box, stage, cap, closeBtn, lastFocus;

    function build() {
      box = document.createElement('div');
      box.className = 'lightbox';
      box.hidden = true;
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', ui('dialog'));
      box.innerHTML =
        '<button type="button" class="lightbox__close" aria-label="' + ui('close') + '">&#10005;</button>' +
        '<div class="lightbox__scroll"><figure class="lightbox__body">' +
        '<div class="lightbox__stage"></div>' +
        '<figcaption class="lightbox__cap"></figcaption>' +
        '</figure></div>';
      document.body.appendChild(box);

      stage = box.querySelector('.lightbox__stage');
      cap = box.querySelector('.lightbox__cap');
      closeBtn = box.querySelector('.lightbox__close');

      closeBtn.addEventListener('click', close);
      // 사진 바깥(어두운 영역)을 누르면 닫는다
      box.addEventListener('click', function (e) {
        if (!e.target.closest('.lightbox__stage, .lightbox__close')) close();
      });
      document.addEventListener('keydown', function (e) {
        if (box.hidden) return;
        if (e.key === 'Escape') { close(); return; }
        // 열려 있는 동안 초점이 밖으로 새지 않게 잡아 둔다
        if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
      });
    }

    function open(el) {
      if (!box) build();
      lastFocus = document.activeElement;
      stage.innerHTML = '';
      stage.classList.toggle('is-vector', el.tagName.toLowerCase() === 'svg');

      if (el.tagName.toLowerCase() === 'svg') {
        stage.appendChild(el.cloneNode(true));
      } else {
        var img = document.createElement('img');
        img.src = el.currentSrc || el.src;
        img.alt = el.alt || '';
        stage.appendChild(img);
      }

      var fc = el.closest('figure') && el.closest('figure').querySelector('figcaption');
      cap.innerHTML = fc ? fc.innerHTML : '';
      cap.hidden = !fc;

      box.hidden = false;
      document.documentElement.classList.add('is-locked');
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      stage.innerHTML = '';
      document.documentElement.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // 이미지 설명(alt)에 '확대해서 보기'를 붙인 접근성 이름 — 언어가 바뀌면 다시 만든다
    function zoomLabel(el) {
      var base = el.tagName.toLowerCase() === 'svg' ? ui('chart') : (el.getAttribute('alt') || ui('image'));
      return lang === 'en' ? base + ' — ' + ui('zoom') : base + ' ' + ui('zoom');
    }
    langListeners.push(function () {
      Array.prototype.forEach.call(triggers, function (el) {
        if (el.classList.contains('is-zoomable')) el.setAttribute('aria-label', zoomLabel(el));
      });
      if (box) {
        box.setAttribute('aria-label', ui('dialog'));
        closeBtn.setAttribute('aria-label', ui('close'));
      }
    });

    Array.prototype.forEach.call(triggers, function (el) {
      // 링크 안에 든 이미지는 링크가 우선이다
      if (el.closest('a')) return;
      el.classList.add('is-zoomable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', zoomLabel(el));
      el.addEventListener('click', function () { open(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
      });
    });
  })();

  /* ------------------------------------------------------------------
     5. 인트로 (홈) — 도트 풍경 히어로
     제목을 글자 단위로 쪼개 순서대로 떠오르게 하고, 포인터가 가까울수록
     글자가 떠오르고 커지며 물든다. 풍경은 포인터 위치에 따라 아주 조금 움직인다.
     ------------------------------------------------------------------ */
  (function introTypography() {
    var intro = document.querySelector('.intro');
    var title = intro && intro.querySelector('h1');
    if (!title || reduceMotion) return;

    var chars = [];

    // 현재 언어의 원문으로 글자를 다시 만든다 (언어를 바꿀 때도 사용)
    function build() {
      var text = title.getAttribute(lang === 'en' ? 'data-en' : 'data-ko').trim();
      title.setAttribute('aria-label', text);      // 스크린리더는 원문 그대로
      title.setAttribute('data-split', '');
      title.textContent = '';
      chars.length = 0;
      text.split(/\s+/).forEach(function (word, w, words) {
        var wordEl = document.createElement('span');
        wordEl.className = 'intro__word';
        wordEl.setAttribute('aria-hidden', 'true');
        Array.from(word).forEach(function (ch) {
          var c = document.createElement('span');
          c.className = 'intro__char';
          c.style.setProperty('--i', chars.length);
          c.textContent = ch;
          wordEl.appendChild(c);
          chars.push({ el: c, x: 0, y: 0, k: 0 });
        });
        title.appendChild(wordEl);
        if (w < words.length - 1) title.appendChild(document.createTextNode(' '));
      });
      wake();
    }
    langListeners.push(build);

    var RADIUS = 150;             // 반응 반경(px)
    var pointer = null;           // {x, y} 또는 null
    var raf = 0;

    function frame() {
      var busy = false;
      chars.forEach(function (c) {
        var r = c.el.getBoundingClientRect();
        // 이동값이 섞이지 않도록 목표는 '원래 자리' 기준으로 계산
        var cx = r.left + r.width / 2 - c.x;
        var cy = r.top + r.height / 2 - c.y;
        var k = 0, dx = 0, dy = 0;
        if (pointer) {
          var ddx = pointer.x - cx, ddy = pointer.y - cy;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          k = Math.max(0, 1 - d / RADIUS);
          k = k * k * (3 - 2 * k);                // smoothstep
          dx = -ddx / (d || 1) * k * 6;           // 살짝 밀려나는 느낌
          dy = -k * 16;
        }
        c.x += (dx - c.x) * .16;
        c.y += (dy - c.y) * .16;
        c.k += (k - c.k) * .16;
        if (Math.abs(dx - c.x) + Math.abs(dy - c.y) + Math.abs(k - c.k) > .01) busy = true;
        c.el.style.translate = c.x.toFixed(2) + 'px ' + c.y.toFixed(2) + 'px';
        c.el.style.scale = (1 + c.k * .3).toFixed(3);
        c.el.style.setProperty('--k', c.k.toFixed(3));
      });
      raf = (pointer || busy) ? requestAnimationFrame(frame) : 0;
    }
    function wake() { if (!raf) raf = requestAnimationFrame(frame); }

    build();
    intro.classList.add('intro--live');

    intro.addEventListener('pointermove', function (e) {
      pointer = { x: e.clientX, y: e.clientY };
      // 풍경 시차: 인트로 중심에서 얼마나 떨어졌는지(-1 ~ 1)
      var box = intro.getBoundingClientRect();
      intro.style.setProperty('--px', (((e.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
      intro.style.setProperty('--py', (((e.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
      wake();
    });
    intro.addEventListener('pointerleave', function () {
      pointer = null;
      intro.style.setProperty('--px', '0');
      intro.style.setProperty('--py', '0');
      wake();
    });
  })();

  /* ------------------------------------------------------------------
     6. 상단 메뉴 현재 위치 (홈)
     화면 가운데에 걸린 섹션의 메뉴 링크에 aria-current 를 준다.
     ------------------------------------------------------------------ */
  (function navCurrent() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);

    function mark(id) {
      links.forEach(function (a) {
        if (a === byId[id]) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) mark(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });   // 화면 세로 가운데 선에 걸릴 때
    sections.forEach(function (sec) { io.observe(sec); });

    // 맨 위(히어로)에서는 표시하지 않는다
    window.addEventListener('scroll', function () {
      if (window.scrollY < 80) mark('');
    }, { passive: true });
  })();

})();
