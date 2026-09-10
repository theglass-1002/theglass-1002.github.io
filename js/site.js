/* ==========================================================================
   정유리 Portfolio — 공통 스크립트
   모바일 내비게이션 / 목차 스크롤스파이 / 앵커 이동
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

})();
