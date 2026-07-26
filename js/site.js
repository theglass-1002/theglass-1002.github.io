/* ==========================================================================
   정유리 Portfolio — 공통 스크립트
   모바일 내비게이션 / 챗봇 / 목차 스크롤스파이 / 방문자 카운터
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
     2. 챗봇
     ------------------------------------------------------------------ */
  (function chatbot() {
    var launcher = document.getElementById('chatLauncher');
    var panel = document.getElementById('chatPanel');
    if (!launcher || !panel) return;

    var closeBtn = panel.querySelector('[data-chat-close]');
    var form = panel.querySelector('[data-chat-form]');
    var input = panel.querySelector('[data-chat-input]');
    var log = panel.querySelector('[data-chat-log]');

    function isOpen() {
      return panel.getAttribute('data-open') === 'true';
    }

    function setOpen(open) {
      panel.setAttribute('data-open', String(open));
      launcher.setAttribute('aria-expanded', String(open));
      launcher.setAttribute('aria-label', open ? '문의 창 닫기' : '문의 창 열기');
      if (open) {
        if (input) input.focus();
      } else {
        launcher.focus();
      }
    }

    launcher.addEventListener('click', function () { setOpen(!isOpen()); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) setOpen(false);
    });

    // 패널 안에서 Tab 순환
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) return;
      var focusables = panel.querySelectorAll('button, input, a[href]');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    function addMessage(text, mine) {
      if (!log) return;
      var el = document.createElement('p');
      el.className = 'chat-msg ' + (mine ? 'chat-msg--me' : 'chat-msg--bot');
      el.textContent = text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var value = input && input.value.trim();
        if (!value) return;
        addMessage(value, true);
        input.value = '';
        window.setTimeout(function () {
          addMessage('메시지 감사합니다. 자동 응답 창이라 답변은 남겨주신 내용을 확인한 뒤 glass.xcx@gmail.com 으로 드릴게요.', false);
        }, 400);
      });
    }
  })();

  /* ------------------------------------------------------------------
     3. 목차 스크롤스파이 (상세 페이지)
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
     4. 부드러운 앵커 이동 (헤더 높이 보정은 scroll-margin-top이 담당)
     ------------------------------------------------------------------ */
  if (!reduceMotion) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  /* ------------------------------------------------------------------
     5. 방문자 카운터 (localStorage 기반)
     ------------------------------------------------------------------ */
  (function visitorCounter() {
    var el = document.getElementById('visitorCount');
    if (!el) return;
    try {
      var total = parseInt(window.localStorage.getItem('portfolioVisits') || '0', 10) || 0;
      var today = new Date().toDateString();
      if (window.localStorage.getItem('portfolioLastVisit') !== today) {
        total += 1;
        window.localStorage.setItem('portfolioVisits', String(total));
        window.localStorage.setItem('portfolioLastVisit', today);
      }
      el.textContent = '방문 ' + total + '회';
    } catch (err) {
      el.remove();
    }
  })();
})();
