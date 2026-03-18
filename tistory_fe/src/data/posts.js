export const posts = [
  {
    id: 1,
    category: "개발 / React",
    title: "React 18의 새로운 기능들 총정리 — Concurrent Mode부터 Suspense까지",
    excerpt:
      "React 18이 공식 출시되면서 많은 새로운 기능들이 추가되었습니다. Concurrent Mode, Suspense, useTransition 훅 등 개발자라면 꼭 알아야 할 핵심 변경사항들을 정리해 보겠습니다.",
    emoji: "🚀",
    bg: "linear-gradient(135deg,#fff3f0,#ffe0d6)",
    date: "2025. 03. 12",
    tags: ["React", "프론트엔드"],
    views: 2841,
    comments: 14,
    likes: 38,
  },
  {
    id: 2,
    category: "개발 / DevOps",
    title: "AWS EC2 없이 Vercel로 Next.js 앱 10분 만에 배포하기",
    excerpt:
      "복잡한 서버 설정 없이도 Vercel을 이용하면 Next.js 프로젝트를 손쉽게 배포할 수 있습니다. Git 연동부터 자동 배포 파이프라인 구성까지 단계별로 알아보겠습니다.",
    emoji: "☁️",
    bg: "linear-gradient(135deg,#f0f7ff,#d6e9ff)",
    date: "2025. 03. 08",
    tags: ["Next.js", "배포"],
    views: 1523,
    comments: 7,
    likes: 22,
  },
  {
    id: 3,
    category: "개발 / Python",
    title: "Python으로 만드는 나만의 크롤러 — requests와 BeautifulSoup 실전 가이드",
    excerpt:
      "웹 크롤링은 데이터 수집의 기본입니다. Python의 requests 라이브러리와 BeautifulSoup을 활용해 실제 사이트에서 데이터를 추출하는 방법을 예제와 함께 다뤄보겠습니다.",
    emoji: "🐍",
    bg: "linear-gradient(135deg,#f0fff4,#d6ffe4)",
    date: "2025. 02. 28",
    tags: ["Python", "크롤링"],
    views: 3107,
    comments: 21,
    likes: 57,
  },
  {
    id: 4,
    category: "일상 / 독서",
    title: "개발자라면 꼭 읽어야 할 책 5권 — 2025년 추천 리스트",
    excerpt:
      "개발 실력을 키우는 데는 코딩 연습만큼 좋은 책을 읽는 것도 중요합니다. 클린 코드부터 디자인 패턴까지, 현직 개발자가 직접 읽고 추천하는 필독서 목록을 공유합니다.",
    emoji: "📚",
    bg: "linear-gradient(135deg,#fffdf0,#fff3c6)",
    date: "2025. 02. 18",
    tags: ["독서", "추천"],
    views: 4209,
    comments: 33,
    likes: 91,
  },
];

export const categories = [
  { name: "전체 글", count: 128 },
  { name: "개발", count: 84, indent: false },
  { name: "· React / Next.js", count: 32, indent: true },
  { name: "· Python", count: 24, indent: true },
  { name: "· DevOps", count: 18, indent: true },
  { name: "일상", count: 28 },
  { name: "리뷰", count: 16 },
];

export const recentComments = [
  { text: "정말 유익한 글이에요! 덕분에 배포 성공했습니다", date: "2025.03.13" },
  { text: "React 18 훅 설명이 너무 명확하네요 감사합니다", date: "2025.03.10" },
  { text: "크롤러 예제 따라하다가 막혔는데 해결됐어요!", date: "2025.03.01" },
];

export const tags = [
  "React", "Python", "Next.js", "TypeScript",
  "배포", "크롤링", "독서", "CSS", "알고리즘", "일상",
];
