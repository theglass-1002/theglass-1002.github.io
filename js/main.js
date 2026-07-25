const projectDataRaw = {
  literacy: {
    title: '문해력 탐험대',
    tag: 'Windows Desktop Program',
    color: '#ff8c42',
    description: 'AI 기반 맞춤형 문해력 학습 윈도우 프로그램. 학생들의 읽기 능력을 실시간으로 진단하고 개인별 맞춤 학습 경로를 제공합니다.',
    features: [
      'Windows 데스크톱 애플리케이션',
      'AI 기반 문해력 실시간 진단 시스템',
      '난이도별 맞춤 문제 자동 생성',
      '게임화된 학습 경험 (탐험대 컨셉)',
      '학습 진척도 시각화 대시보드',
      '학생/교사/관리자 3-tier 구조'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript (Vanilla)', 'AI Integration', 'Chart Visualization', 'Windows Desktop'],
    role: '프론트엔드 퍼블리싱 및 UI/UX 구현',
    period: '2024.03 - 2024.08 (6개월)',
    startDate: '2024-03',
    images: [],
    link: null
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
    role: '프론트엔드 UI/UX 개발 및 면접 플로우 구현',
    period: '2024.01 - 2024.06 (6개월)',
    startDate: '2024-01',
    images: [
      'images/projects/interview/screen-1.png',
      'images/projects/interview/screen-2.png',
      'images/projects/interview/screen-3.png',
      'images/projects/interview/screen-4.png',
      'images/projects/interview/screen-5.png'
    ],
    link: null
  },
  jango: {
    title: '장고 (장애인고용 플랫폼)',
    tag: 'Employment Platform',
    color: '#a78bfa',
    description: '장애인 구직자, 기업, 복지사를 연결하는 통합 고용 플랫폼. AI 모의면접과 접근성을 최우선으로 설계된 3개 버전의 웹사이트입니다.',
    features: [
      'AI 모의면접 - 이력서 기반 맞춤형 질문 생성',
      '구직자/기업/복지사 3개 독립 웹사이트',
      'WCAG 2.1 AA 수준 웹 접근성 준수',
      '채용 공고/이력서 통합 관리 시스템',
      'Firebase 실시간 알림 및 인증',
      '모의면접 진행 현황 대시보드'
    ],
    tech: ['React 19', 'TypeScript', 'Firebase', 'Vite', 'React Router', 'AI Integration'],
    role: '3개 버전 풀스택 개발 (프론트엔드 중심)',
    period: '2023.09 - 2024.02 (6개월)',
    startDate: '2023-09',
    images: [
      'images/projects/jango/screen-1.png',
      'images/projects/jango/screen-2.png',
      'images/projects/jango/screen-3.png',
      'images/projects/jango/screen-4.png',
      'images/projects/jango/screen-5.png'
    ],
    links: [
      { name: '구직자', url: 'https://jango.kr' },
      { name: '기업', url: 'https://company.jango.kr' },
      { name: '복지관', url: 'https://welfare.jango.kr' }
    ]
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
    role: '프론트엔드 UI/UX 개발 및 백엔드 연동',
    period: '2023.03 - 2023.08 (6개월)',
    startDate: '2023-03',
    images: [
      'images/projects/jobkok/screen-1.png',
      'images/projects/jobkok/screen-2.png'
    ],
    link: 'https://jobkok.kr'
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
    role: '프론트엔드 전체 개발 및 AI API 연동',
    period: '2024.09 - 2024.12 (4개월)',
    startDate: '2024-09',
    images: [],
    link: null
  },
  zentry: {
    title: '젠트리 (Zentry)',
    tag: 'Pet Digital Healthcare Platform',
    color: '#4ea8f7',
    description: '심부전 등 만성 질환을 앓는 반려동물을 위한 디지털 헬스케어 솔루션. 가정용 모니터링 기기부터 수의사용 전문 마취 모니터링 장비까지, 반려동물의 건강 상태를 실시간으로 체계적으로 관리하는 "두리틀" 시리즈 플랫폼입니다.',
    features: [
      '두리틀 수의사용 APP - 전문 마취 모니터링 및 건강 관리',
      '젠트리 공식 웹사이트 - 반응형 UI/UX 구현',
      '젠트리 관리자용 사이트 - 실시간 데이터 관리 대시보드',
      '가정용/수의사용 모니터링 장비 연동',
      '심부전 등 만성 질환 반려동물 특화 기능',
      'REST API 기반 실시간 데이터 동기화',
      'TCP/WebSocket 통신으로 의료기기 연동'
    ],
    tech: ['Dart', 'HTML/CSS', 'JavaScript', 'React', 'MySQL', 'WebSocket', 'Medical Device Integration'],
    role: '두리틀 수의사용 APP 퍼블리싱 및 웹사이트 2종 개발',
    period: '2022.09 - 2025.02 (2년 6개월)',
    startDate: '2022-09',
    images: [],
    link: 'https://zentry.kr'
  },
  newO: {
    title: '뉴오 (NewO)',
    tag: '🚀 Startup Project',
    color: '#ff8c42',
    description: '(창업) 학원 직원들이 팀노바 학생들을 효율적으로 관리할 수 있도록 개발된 학원생 관리 서비스. 코로나로 인해 대면 업무가 어려워진 상황에서, 메타버스 기반 시스템을 도입하여 원활한 소통과 관리가 가능하도록 개선한 플랫폼입니다.',
    features: [
      '창업 프로젝트 - 학원생 관리 서비스',
      'Phaser.js 기반 2D 메타버스 공간',
      '코로나 시대 비대면 학원 관리 솔루션',
      '캐릭터 커스터마이징 시스템',
      '실시간 채팅 및 멘토링 기능',
      '학습 일정 관리 및 TODO 시스템',
      '게시판 및 피드백 제공'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'PHP', 'Java', 'Phaser.js', 'Bootstrap', 'MariaDB', 'Redis'],
    role: '뉴오 공식 페이지 프론트엔드 개발',
    period: '2022.02 - 2022.06 (4개월)',
    startDate: '2022-02',
    images: [],
    link: null
  },
  energy: {
    title: '메타버스 에너지 전시관',
    tag: '🏆 Award Winning Project',
    color: '#fbbf24',
    description: '한전KDN 데이터 결합·활용 아이디어 공모전 장려상 수상작. 코로나19나 거리상의 제약으로 인해 전시관 방문이 어려운 이들을 위해, 에너지 데이터를 메타버스 공간에서 체험할 수 있도록 기획한 가상 전시관 프로그램입니다.',
    features: [
      '한전KDN 공모전 장려상 수상 (2022.03)',
      '3D 메타버스 전시 공간 구현',
      '에너지 데이터 시각화 및 체험형 콘텐츠',
      '실시간 인터랙티브 체험 시스템',
      '공간 내 자유로운 이동 및 탐색',
      '비대면 전시관 관람 솔루션'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Three.js', 'WebGL', 'Data Visualization', 'Metaverse'],
    role: '체험형 전시관 프론트엔드 개발 및 3D 공간 구현',
    period: '2022.03 (대회)',
    startDate: '2022-03-15',
    images: [],
    link: null
  },
  careform: {
    title: '케어팜 (CareForm)',
    tag: '💡 Personal Project',
    color: '#10b981',
    description: '(개인 프로젝트) 간병인이 필요한 사용자와 간병인을 하고 싶은 사용자를 매칭시켜주며 주변 요양 시설을 찾을 수 있는 앱입니다.',
    features: [
      '개인 프로젝트 - 간병인 매칭 서비스',
      '간병인/사용자 매칭 알고리즘',
      '주변 요양 시설 검색 기능',
      '회원가입 및 프로필 관리',
      '리뷰 및 평점 시스템',
      '일정 관리 및 알림 시스템'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Bootstrap', 'Apache', 'Nginx'],
    role: '케어팜 APP 프론트엔드 개발',
    period: '2021 (개인 프로젝트)',
    startDate: '2021-06',
    images: [],
    link: null
  },
  sketchers: {
    title: '스케쳐스 (Sketchers)',
    tag: '💡 Personal Project',
    color: '#a78bfa',
    description: '(개인 프로젝트) 스케치 자료를 올릴 수 있으며 자료를 종류별로 정리하고 자료를 보면서 스케치 능력을 향상시키는 앱입니다.',
    features: [
      '개인 프로젝트 - 스케치 학습 플랫폼',
      '스케치 자료 업로드 및 공유',
      '종류별 자료 분류 시스템',
      '자료 갤러리 및 검색 기능',
      '사용자 프로필 및 포트폴리오',
      '반응형 디자인'
    ],
    tech: ['HTML/CSS', 'JavaScript', 'Bootstrap', 'Apache', 'MySQL'],
    role: '스케쳐스 APP 풀스택 개발',
    period: '2021 (개인 프로젝트)',
    startDate: '2021-05',
    images: [],
    link: null
  }
};

// 날짜순으로 정렬 (최신순)
const projectData = Object.fromEntries(
  Object.entries(projectDataRaw).sort((a, b) => {
    return b[1].startDate.localeCompare(a[1].startDate);
  })
);

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

  let imagesHTML = '';
  if (data.images && data.images.length > 0) {
    imagesHTML = `
      <h3 style="margin-top: 2rem">디자인 화면</h3>
      <div class="project-screenshots">
        ${data.images.map(img => `<img src="${img}" alt="${data.title} 스크린샷" loading="lazy">`).join('')}
      </div>
    `;
  }

  let linkHTML = '';
  if (data.links && data.links.length > 0) {
    linkHTML = `
      <h3 style="margin-top: 2rem">사이트 주소</h3>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${data.links.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer"
             style="padding: 0.75rem 1.5rem; background: ${data.color}33; color: ${data.color};
                    border: 1px solid ${data.color}; border-radius: 8px; text-decoration: none;
                    font-weight: 500; transition: all 0.3s;">
            ${link.name} →
          </a>
        `).join('')}
      </div>
    `;
  } else if (data.link) {
    linkHTML = `
      <h3 style="margin-top: 2rem">사이트 주소</h3>
      <p><a href="${data.link}" target="_blank" rel="noopener noreferrer" style="color: ${data.color}; text-decoration: underline;">${data.link}</a></p>
    `;
  }

  let periodHTML = '';
  if (data.period) {
    periodHTML = `
      <h3 style="margin-top: 2rem">개발 기간</h3>
      <p>${data.period}</p>
    `;
  }

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

    ${periodHTML}
    ${linkHTML}
    ${imagesHTML}
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
