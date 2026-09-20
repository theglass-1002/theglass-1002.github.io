/* ==========================================================================
   정유리 Portfolio — 공통 스크립트
   모바일 내비게이션 / 목차 스크롤스파이 / 앵커 이동
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     0. 언어 전환 (홈) — KO ⇄ EN
     한국어 원문이 기준이다. data-en / data-en-alt 가 붙은 요소만 바뀌고,
     처음 한 번 원문을 data-ko 에 보관해 둔다. 선택은 localStorage 에 기억한다.
     ------------------------------------------------------------------ */
  var LANG_KEY = 'portfolio-lang';
  var lang = 'ko';
  var langListeners = [];
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'ko') lang = saved;
  } catch (e) { /* 저장소를 못 쓰면 한국어로 시작 */ }

  (function language() {
    var toggle = document.querySelector('[data-lang-toggle]');
    var nodes = document.querySelectorAll('[data-en]');
    var altNodes = document.querySelectorAll('[data-en-alt]');
    if (!toggle || !nodes.length) return;

    var TITLE = { ko: document.title, en: 'Yuri Jung — Frontend Developer' };
    nodes.forEach(function (n) { n.setAttribute('data-ko', n.innerHTML); });
    altNodes.forEach(function (n) { n.setAttribute('data-ko-alt', n.getAttribute('alt')); });

    function apply(next) {
      lang = next;
      var attr = next === 'en' ? 'data-en' : 'data-ko';
      var altAttr = next === 'en' ? 'data-en-alt' : 'data-ko-alt';
      document.documentElement.lang = next;
      document.title = TITLE[next];
      toggle.setAttribute('aria-checked', String(next === 'en'));
      // 글자 단위로 쪼개진 제목은 intro 스크립트가 직접 다시 만든다
      nodes.forEach(function (n) {
        if (!n.hasAttribute('data-split')) n.innerHTML = n.getAttribute(attr);
      });
      altNodes.forEach(function (n) { n.setAttribute('alt', n.getAttribute(altAttr)); });
      langListeners.forEach(function (fn) { fn(next); });
    }

    toggle.addEventListener('click', function () {
      var next = lang === 'en' ? 'ko' : 'en';
      apply(next);
      try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* 무시 */ }
    });

    if (lang === 'en') apply('en');
  })();

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
      box.setAttribute('aria-label', '확대 보기');
      box.innerHTML =
        '<button type="button" class="lightbox__close" aria-label="닫기">&#10005;</button>' +
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

    Array.prototype.forEach.call(triggers, function (el) {
      // 링크 안에 든 이미지는 링크가 우선이다
      if (el.closest('a')) return;
      el.classList.add('is-zoomable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      var label = el.tagName.toLowerCase() === 'svg' ? '플로우차트' : (el.alt || '이미지');
      el.setAttribute('aria-label', label + ' 확대해서 보기');
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
