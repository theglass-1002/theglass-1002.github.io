const projectData = {
  literacy: {
    title: '문해력 탐험대',
    tag: 'AI Education Platform',
    color: '#ff8c42',
    description: 'AI 기반 맞춤형 문해력 학습 플랫폼으로, 학생들의 읽기 능력을 실시간으로 진단하고 개인별 맞춤 학습 경로를 제공합니다.',
    features: [
      'AI 기반 문해력 실시간 진단 시스템',
      '난이도별 맞춤 문제 자동 생성',
      '게임화된 학습 경험 (탐험대 컨셉)',
      '학습 진척도 시각화 대시보드',
      '학생/교사/관리자 3-tier 구조'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript (Vanilla)', 'AI Integration', 'Chart Visualization'],
    role: '프론트엔드 퍼블리싱 및 UI/UX 구현'
  },
  interview: {
    title: '면접왕 (승무원 버전)',
    tag: 'AI Flight Attendant Interview',
    color: '#4ea8f7',
    description: '승무원 면접 특화 AI 모의면접 플랫폼. 대입/취업 모의면접 선택부터 실시간 영상 분석, 항공사별 맞춤 질문까지 전 과정을 지원합니다.',
    features: [
      '대입/취업 모의면접 듀얼 모드 제공',
      'CROVAI 가이드 영상 시스템',
      '실시간 AI 분석 (외모 단정, 화면 환명, 얼굴 위치, 목소리 톤)',
      '항공사별 맞춤 질문 데이터베이스',
      '4단계 체크 시스템 (가이드 → 주의사항 → 체크 → 정보입력)',
      '종합 분석 리포트 및 개선점 제공'
    ],
    tech: ['jQuery', 'Chart.js', 'WebRTC', 'Swiper.js', 'AI Vision Analysis', 'CROVAI'],
    role: '프론트엔드 UI/UX 개발 및 면접 플로우 구현'
  },
  jango: {
    title: '장고 (장애인고용 플랫폼)',
    tag: 'Employment Platform',
    color: '#a78bfa',
    description: '장애인 구직자, 기업, 복지사를 연결하는 통합 고용 플랫폼. 접근성을 최우선으로 설계된 3개 버전의 웹사이트입니다.',
    features: [
      '구직자/기업/복지사 3개 독립 웹사이트',
      'WCAG 2.1 AA 수준 웹 접근성 준수',
      'Firebase 실시간 알림 시스템',
      '이력서 자동 매칭 알고리즘',
      '채용 공고 검색 및 필터링'
    ],
    tech: ['React 19', 'TypeScript', 'Firebase', 'Vite', 'React Router'],
    role: '3개 버전 풀스택 개발 (프론트엔드 중심)'
  },
  jobkok: {
    title: '잡콕 (JobKok)',
    tag: 'Job Portal',
    color: '#10b981',
    description: '사람인형 구인구직 플랫폼. 깔끔한 디자인 시스템과 직관적인 필터링으로 구직자와 기업을 빠르게 연결합니다.',
    features: [
      '통합 검색 엔진 (직무/지역/경력/학력/급여)',
      '스크롤 시 헤더 배경/보더 추가 인터랙션',
      '다중 필터 시스템 (이력서 공개/즉시·수시 채용)',
      '기업 로고 및 태그 기반 채용 공고 카드 UI',
      '반응형 디자인 (모바일/태블릿/데스크톱)',
      '페이지네이션 및 정렬 기능 (최신순/인기순)'
    ],
    tech: ['Java Spring', 'HTML/CSS', 'JavaScript', 'MySQL', 'RESTful API'],
    role: '프론트엔드 UI/UX 개발 및 백엔드 연동'
  },
  kiosk: {
    title: '홀로그램 AI 키오스크',
    tag: 'AI Voice Kiosk',
    color: '#f472b6',
    description: 'Gemini API를 활용한 음성 주문 카페 키오스크. 자연어 대화로 주문부터 결제까지 완성하는 미래형 무인 주문 시스템입니다.',
    features: [
      'Gemini API 음성인식 및 자연어 처리',
      '홀로그램 디스플레이 연동',
      '실시간 메뉴 추천 시스템',
      'PG 결제 통합 (카드/간편결제)',
      '관리자 대시보드 (품절/매출/주문)'
    ],
    tech: ['React 19', 'TypeScript', 'Gemini API', 'Vite', 'Voice Recognition', 'Firebase'],
    role: '프론트엔드 전체 개발 및 AI API 연동'
  },
  zentry: {
    title: '젠트리 (Zentry)',
    tag: 'Pet Healthcare Platform',
    color: '#4ea8f7',
    description: '반려동물 건강 관리 통합 플랫폼. 웨어러블 디바이스로 실시간 건강 데이터를 수집하고, 수의사와 보호자를 연결합니다.',
    features: [
      '두리틀 앱 - 보호자용 반려동물 건강 모니터링',
      '젠트리 공식 웹사이트 - 반응형 UI/UX',
      '젠트리 관리자용 웹사이트 - 실시간 데이터 관리',
      'REST API 기반 실시간 데이터 동기화',
      'TCP/WebSocket 통신으로 웨어러블 연동'
    ],
    tech: ['Dart', 'HTML/CSS', 'JavaScript', 'React', 'MySQL', 'WebSocket'],
    role: '두리틀 앱 퍼블리싱 및 웹사이트 3종 개발 (2년 6개월)'
  },
  newO: {
    title: '뉴오 (NewO)',
    tag: 'Metaverse Education',
    color: '#ff8c42',
    description: '틴노바 학원생을 위한 메타버스 기반 온라인 학습 플랫폼. 캐릭터 커스터마이징과 게임화로 몰입도 높은 학습 경험을 제공합니다.',
    features: [
      'Phaser.js 기반 2D 메타버스 공간',
      '캐릭터 커스터마이징 시스템',
      '실시간 채팅 및 멘토링 기능',
      '학습 일정 관리 및 TODO 시스템',
      '게시판 및 피드백 제공'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'PHP', 'Java', 'Phaser.js', 'Bootstrap', 'MariaDB', 'Redis'],
    role: '프론트엔드 개발 (40%) 및 UI/UX 제공 (4개월)'
  },
  careform: {
    title: '케어팜 (CareForm)',
    tag: 'Developer Tools',
    color: '#10b981',
    description: '간병인이 필요한 사용자와 간병인을 매칭하는 서비스. 손쉬운 사용자 경험으로 빠른 매칭을 지원합니다.',
    features: [
      '간병인/사용자 회원가입 및 프로필 관리',
      '실시간 매칭 알고리즘',
      '리뷰 및 평점 시스템',
      '일정 관리 캘린더',
      '알림 시스템 (이메일/SMS)'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Bootstrap', 'Apache', 'Nginx'],
    role: '프론트엔드 퍼블리싱 개발'
  },
  sketchers: {
    title: '스케쳐스 (Sketchers)',
    tag: 'E-commerce Platform',
    color: '#a78bfa',
    description: '스케쳐스 쇼핑몰 웹사이트. 상품 조회, 장바구니, 결제 시스템을 구현한 E-commerce 플랫폼입니다.',
    features: [
      '상품 카탈로그 및 검색 기능',
      '장바구니 및 주문 시스템',
      '회원가입 및 로그인 (세션 관리)',
      '관리자 페이지 (상품/주문 관리)',
      '반응형 디자인'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Bootstrap', 'Apache', 'MySQL'],
    role: '풀스택 개발 (쇼핑몰 자료 출력 및 정리)'
  }
};

// Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.bento-item').forEach(item => {
  observer.observe(item);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Modal
function openModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalTitle').style.color = data.color;

  document.getElementById('modalMeta').innerHTML = `
    <span class="project-tag" style="background: ${data.color}33; color: ${data.color}">${data.tag}</span>
  `;

  document.getElementById('modalBody').innerHTML = `
    <h3>프로젝트 소개</h3>
    <p>${data.description}</p>

    <h3>주요 기능</h3>
    <ul>
      ${data.features.map(f => `<li>${f}</li>`).join('')}
    </ul>

    <h3>기술 스택</h3>
    <div class="project-tech">
      ${data.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
    </div>

    <h3 style="margin-top: 2rem">담당 역할</h3>
    <p>${data.role}</p>
  `;

  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

// Project click events
document.querySelectorAll('.bento-item').forEach(item => {
  item.addEventListener('click', (e) => {
    if (!e.target.classList.contains('project-link')) {
      const projectId = item.dataset.project;
      openModal(projectId);
    }
  });

  item.querySelector('.project-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(item.dataset.project);
  });
});

// Close modal on outside click
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    closeModal();
  }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
