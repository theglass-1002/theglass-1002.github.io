/* ==========================================================================
   시간대별 하늘 — <head> 에서 바로 실행해 첫 화면부터 맞는 하늘로 그린다.
   morning 06–11 · afternoon 11–17 · sunset 17–20 · night 20–06 (보는 사람의 현지 시각)
   ?time=morning|afternoon|sunset|night 로 고정해서 볼 수 있다.
   '하늘 바꾸기'로 고른 하늘은 같은 탭 안에서 다른 페이지(상세)로 가도 유지된다 (sessionStorage).
   계절: 월 기준 data-season (나무 색 · 낙엽 · 꽃잎).
   날씨: 오늘 서울 현재 날씨(Open-Meteo, 키 없음)를 30분 캐시. ?weather=clear|cloudy|rain|snow|storm 로 고정.
   ========================================================================== */
(function () {
  var ORDER = ['morning', 'afternoon', 'sunset', 'night'];
  var SAMPLE = { morning: 9, afternoon: 14, sunset: 18.5, night: 22.5 };   // 미리보기용 대표 시각
  var root = document.documentElement;

  function phase(h) {
    if (h >= 6 && h < 11) return 'morning';
    if (h >= 11 && h < 17) return 'afternoon';
    if (h >= 17 && h < 20) return 'sunset';
    return 'night';
  }
  function hoursNow() { var d = new Date(); return d.getHours() + d.getMinutes() / 60; }

  var KEY = 'sky-time';
  var forced = null;
  try {
    var q = new URLSearchParams(location.search).get('time');
    if (ORDER.indexOf(q) > -1) forced = q;
    else {
      var saved = sessionStorage.getItem(KEY);
      if (ORDER.indexOf(saved) > -1) forced = saved;
    }
  } catch (e) { /* 무시 */ }

  var shown = forced || phase(hoursNow());
  root.setAttribute('data-time', shown);

  /* 계절: 봄 3–5월 · 여름 6–8월 · 가을 9–11월 · 겨울 12–2월 (?season= 으로 고정) */
  var SEASONS = ['spring', 'summer', 'autumn', 'winter'];
  var season = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'][new Date().getMonth()];
  try {
    var qs = new URLSearchParams(location.search).get('season');
    if (SEASONS.indexOf(qs) > -1) season = qs;
  } catch (e) { /* 무시 */ }
  root.setAttribute('data-season', season);

  /* 해는 06–20시, 달은 20–06시 동안 떠서 진다.
     제목과 상태창 사이 빈 하늘(가로 62–88%, 제목 오른쪽, 세로 위쪽)만 지나가서 글과 패널을 가리지 않는다 */
  function place(h) {
    var day = h >= 6 && h < 20;
    var t = day ? (h - 6) / 14 : ((h - 20 + 24) % 24) / 10;
    root.style.setProperty('--orb-x', (62 + 26 * t).toFixed(1) + '%');
    root.style.setProperty('--orb-y', (30 - 16 * Math.sin(Math.PI * t)).toFixed(1) + '%');
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    var d = new Date();
    var el = document.querySelector('[data-clock-time]');
    if (el) el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes());
    if (!forced) {
      var p = phase(hoursNow());
      if (p !== shown) { shown = p; root.setAttribute('data-time', p); label(); }
      place(hoursNow());
    }
  }
  function label() {
    var el = document.querySelector('[data-clock-label]');
    if (el) el.textContent = shown;
  }

  place(forced ? SAMPLE[forced] : hoursNow());

  /* ---- 서울 날씨 ---- */
  var WX_KO = { clear: '맑음', cloudy: '흐림', rain: '비', snow: '눈', storm: '뇌우' };
  function wxFromCode(c) {   // WMO weather code
    if (c <= 1) return 'clear';
    if (c <= 48) return 'cloudy';
    if (c >= 95) return 'storm';
    if ((c >= 71 && c <= 77) || c === 85 || c === 86) return 'snow';
    return 'rain';
  }
  function setWx(w) {
    root.setAttribute('data-weather', w);
    var el = document.querySelector('[data-clock-weather]');
    if (el) el.textContent = (root.lang === 'en' ? w : WX_KO[w]);
  }
  var wxForced = null;
  try {
    var qw = new URLSearchParams(location.search).get('weather');
    if (WX_KO[qw]) wxForced = qw;
  } catch (e) { /* 무시 */ }
  function loadWeather() {
    if (wxForced) { setWx(wxForced); return; }
    try {
      var c = JSON.parse(sessionStorage.getItem('seoul-wx') || 'null');
      if (c && Date.now() - c.t < 30 * 60 * 1000) { setWx(c.w); return; }
    } catch (e) { /* 무시 */ }
    if (!window.fetch) return;
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.978&current=weather_code&timezone=Asia%2FSeoul')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.current) return;
        var w = wxFromCode(d.current.weather_code);
        try { sessionStorage.setItem('seoul-wx', JSON.stringify({ w: w, t: Date.now() })); } catch (e) { /* 무시 */ }
        setWx(w);
      })
      .catch(function () { /* 날씨를 못 받으면 맑은 하늘 그대로 */ });
  }
  if (wxForced) root.setAttribute('data-weather', wxForced);

  document.addEventListener('DOMContentLoaded', function () {
    tick(); label(); loadWeather();
    setInterval(tick, 30000);

    /* 하늘 바꿔 보기 — 아침 → 오후 → 노을 → 밤 → 지금 시각 → … (고른 하늘은 탭 안에서 유지) */
    var btn = document.querySelector('[data-time-cycle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (forced === 'night') {   // 한 바퀴 돌면 실제 시각으로 돌아온다
        forced = null;
        try { sessionStorage.removeItem(KEY); } catch (e) { /* 무시 */ }
        shown = phase(hoursNow());
        root.setAttribute('data-time', shown);
        place(hoursNow());
        label();
        return;
      }
      var next = forced ? ORDER[ORDER.indexOf(forced) + 1] : ORDER[(ORDER.indexOf(shown) + 1) % ORDER.length];
      forced = next; shown = next;
      try { sessionStorage.setItem(KEY, next); } catch (e) { /* 무시 */ }
      root.setAttribute('data-time', next);
      place(SAMPLE[next]);
      label();
    });
  });
})();
