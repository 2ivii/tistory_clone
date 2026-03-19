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
    tags: ["React", "프론트엔드", "Concurrent"],
    views: 2841,
    comments: 14,
    likes: 38,
    author: "개발자K",
    authorEmoji: "👩‍💻",
    readTime: "8분",
    content: `
<h2>들어가며</h2>
<p>React 18이 드디어 공식 출시되었습니다. 이번 메이저 업데이트에는 개발자 경험을 크게 향상시키는 다양한 새 기능이 포함되었는데요, 핵심 변경 사항들을 하나씩 살펴보겠습니다.</p>

<h2>1. Concurrent Mode의 기본 활성화</h2>
<p>React 18의 가장 큰 변화 중 하나는 Concurrent Mode가 기본으로 활성화된다는 점입니다. 기존에는 <code>ReactDOM.render()</code>를 사용했지만, 이제는 <code>createRoot()</code>를 사용해 앱을 마운트해야 합니다.</p>

<pre><code>// React 17 방식
ReactDOM.render(&lt;App /&gt;, document.getElementById('root'));

// React 18 방식
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(&lt;App /&gt;);</code></pre>

<p>Concurrent Mode를 사용하면 React가 렌더링 작업을 <strong>중단하고, 재개하고, 폐기</strong>할 수 있게 됩니다. 이를 통해 무거운 렌더링 작업이 있어도 UI가 멈추지 않고 사용자 입력에 즉각 반응할 수 있습니다.</p>

<h2>2. useTransition 훅</h2>
<p><code>useTransition</code>은 상태 업데이트를 "긴급"과 "비긴급"으로 구분할 수 있게 해주는 새로운 훅입니다.</p>

<pre><code>import { useState, useTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 긴급 업데이트: 입력값은 즉시 반영
    setQuery(e.target.value);

    // 비긴급 업데이트: 검색 결과는 천천히
    startTransition(() => {
      setResults(searchData(e.target.value));
    });
  };

  return (
    &lt;div&gt;
      &lt;input value={query} onChange={handleChange} /&gt;
      {isPending ? &lt;Spinner /&gt; : &lt;List items={results} /&gt;}
    &lt;/div&gt;
  );
}</code></pre>

<blockquote>💡 <strong>핵심 포인트</strong>: <code>isPending</code>을 활용하면 데이터 로딩 중 로딩 스피너를 쉽게 표시할 수 있습니다.</blockquote>

<h2>3. Suspense의 서버 사이드 렌더링 지원</h2>
<p>React 18에서는 Suspense가 서버 사이드 렌더링에서도 완전히 동작합니다. 이제 페이지의 일부는 빠르게 HTML을 스트리밍하고, 나머지는 데이터가 준비되는대로 점진적으로 렌더링할 수 있습니다.</p>

<pre><code>function App() {
  return (
    &lt;Layout&gt;
      &lt;Suspense fallback={&lt;HeaderSkeleton /&gt;}&gt;
        &lt;Header /&gt;
      &lt;/Suspense&gt;
      &lt;Suspense fallback={&lt;ContentSkeleton /&gt;}&gt;
        &lt;Content /&gt;
      &lt;/Suspense&gt;
    &lt;/Layout&gt;
  );
}</code></pre>

<h2>4. useDeferredValue</h2>
<p><code>useDeferredValue</code>는 <code>useTransition</code>과 유사하지만, 제어권이 없는 외부 값을 지연시킬 때 사용합니다.</p>

<pre><code>import { useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);

  // deferredQuery는 실제 query보다 살짝 뒤처져서 업데이트됩니다
  return &lt;ExpensiveList filter={deferredQuery} /&gt;;
}</code></pre>

<h2>5. Automatic Batching</h2>
<p>React 17까지는 React 이벤트 핸들러 내부에서만 상태 업데이트가 일괄 처리(batching)되었습니다. React 18부터는 <strong>어디서든</strong> 자동으로 배치됩니다.</p>

<pre><code>// React 18: setTimeout 안에서도 한 번만 리렌더링
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 두 상태 변경이 자동으로 배치됨 → 리렌더링 1회
}, 1000);</code></pre>

<h2>마치며</h2>
<p>React 18은 개발자에게 더 많은 성능 최적화 도구를 제공하면서도, 기존 코드와의 하위 호환성을 잘 유지하고 있습니다. 특히 <code>createRoot</code>로의 마이그레이션은 간단하므로 기존 프로젝트에도 빠르게 적용해 보시기 바랍니다.</p>
    `,
    relatedIds: [2, 3],
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
    tags: ["Next.js", "배포", "Vercel"],
    views: 1523,
    comments: 7,
    likes: 22,
    author: "개발자K",
    authorEmoji: "👩‍💻",
    readTime: "5분",
    content: `
<h2>Vercel이란?</h2>
<p>Vercel은 Next.js를 만든 팀이 운영하는 프론트엔드 배포 플랫폼입니다. Git 레포지토리와 연동하면 push할 때마다 자동으로 빌드·배포가 이루어집니다. 무료 플랜도 개인 프로젝트에는 충분합니다.</p>

<h2>1단계: Vercel 계정 연동</h2>
<p>Vercel 공식 사이트에서 GitHub 계정으로 회원가입합니다. 그 다음 <strong>New Project</strong> 버튼을 클릭하고 배포할 레포지토리를 선택합니다.</p>

<blockquote>💡 Vercel은 Next.js 프레임워크를 자동으로 감지하여 빌드 명령어와 출력 디렉토리를 자동으로 설정해 줍니다.</blockquote>

<h2>2단계: 환경 변수 설정</h2>
<p>프로젝트 설정 페이지에서 <code>Environment Variables</code> 탭을 열고 필요한 환경 변수를 추가합니다.</p>

<pre><code>NEXT_PUBLIC_API_URL=https://api.your-domain.com
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key</code></pre>

<h2>3단계: 배포 트리거</h2>
<p>설정이 완료되면 <strong>Deploy</strong> 버튼을 클릭합니다. 처음 배포는 약 1~2분 정도 소요됩니다. 이후부터는 main 브랜치에 push할 때마다 자동으로 배포됩니다.</p>

<h2>프리뷰 배포 활용하기</h2>
<p>Vercel의 강력한 기능 중 하나는 Pull Request마다 고유한 프리뷰 URL을 생성한다는 것입니다. 팀원들이 리뷰하기 전에 실제 배포 환경에서 변경 사항을 확인할 수 있습니다.</p>

<pre><code>git checkout -b feature/new-header
git push origin feature/new-header
# → Vercel이 자동으로 프리뷰 URL 생성
# → PR에 댓글로 URL 추가</code></pre>

<h2>마치며</h2>
<p>Vercel은 Next.js 프로젝트의 배포를 극단적으로 단순화해줍니다. 서버 관리에 시간을 쓰지 않고 개발에만 집중할 수 있다는 것이 가장 큰 장점입니다.</p>
    `,
    relatedIds: [1, 4],
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
    tags: ["Python", "크롤링", "BeautifulSoup"],
    views: 3107,
    comments: 21,
    likes: 57,
    author: "개발자K",
    authorEmoji: "👩‍💻",
    readTime: "10분",
    content: `
<h2>웹 크롤링이란?</h2>
<p>웹 크롤링은 프로그래밍으로 웹페이지에 접근해 원하는 데이터를 수집하는 기술입니다. 가격 비교, 뉴스 수집, 연구 데이터 수집 등 다양한 곳에서 활용됩니다.</p>

<blockquote>⚠️ <strong>주의</strong>: 크롤링 전에 반드시 해당 사이트의 robots.txt와 이용약관을 확인하세요. 무분별한 크롤링은 법적 문제로 이어질 수 있습니다.</blockquote>

<h2>1. 라이브러리 설치</h2>
<pre><code>pip install requests beautifulsoup4 lxml</code></pre>

<h2>2. 기본 크롤링 구조</h2>
<pre><code>import requests
from bs4 import BeautifulSoup

def crawl(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # HTTP 에러 시 예외 발생

    soup = BeautifulSoup(response.text, 'lxml')
    return soup

soup = crawl('https://example.com')
print(soup.title.text)</code></pre>

<h2>3. 원하는 데이터 추출하기</h2>
<p>BeautifulSoup은 CSS 선택자와 태그 이름으로 원하는 요소를 쉽게 찾을 수 있습니다.</p>

<pre><code># 태그로 찾기
title = soup.find('h1').text

# CSS 선택자로 찾기
items = soup.select('.product-list .item')

# 여러 요소 찾기
links = soup.find_all('a', class_='post-link')
for link in links:
    print(link['href'], link.text.strip())</code></pre>

<h2>4. 페이지네이션 처리</h2>
<pre><code>def crawl_all_pages(base_url, max_pages=10):
    results = []
    for page in range(1, max_pages + 1):
        url = f"{base_url}?page={page}"
        soup = crawl(url)

        items = soup.select('.item')
        if not items:
            break  # 더 이상 데이터 없으면 종료

        for item in items:
            results.append({
                'title': item.select_one('.title').text.strip(),
                'date': item.select_one('.date').text.strip(),
            })

        time.sleep(1)  # 서버 부하 방지
    return results</code></pre>

<h2>5. 데이터 저장</h2>
<pre><code>import csv
import json

# CSV 저장
with open('data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['title', 'date'])
    writer.writeheader()
    writer.writerows(results)

# JSON 저장
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)</code></pre>

<h2>마치며</h2>
<p>requests + BeautifulSoup 조합은 정적 페이지 크롤링에 가장 적합합니다. JavaScript로 렌더링되는 동적 페이지는 Selenium이나 Playwright를 사용해야 합니다. 다음 포스팅에서는 Playwright를 활용한 동적 크롤링을 다뤄보겠습니다.</p>
    `,
    relatedIds: [4, 1],
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
    tags: ["독서", "추천", "개발자"],
    views: 4209,
    comments: 33,
    likes: 91,
    author: "개발자K",
    authorEmoji: "👩‍💻",
    readTime: "6분",
    content: `
<h2>들어가며</h2>
<p>개발을 잘 하려면 코드를 많이 짜야 한다는 말은 맞습니다. 하지만 좋은 책 한 권이 몇 달치 실무 경험을 압축해 전달해 주기도 합니다. 제가 직접 읽고 삶에 큰 영향을 준 책 5권을 소개합니다.</p>

<h2>1. 클린 코드 (Clean Code) — Robert C. Martin</h2>
<p>개발자라면 반드시 읽어야 할 고전입니다. 단순히 동작하는 코드가 아닌 <strong>읽기 쉽고 유지보수하기 좋은 코드</strong>를 작성하는 방법을 가르쳐 줍니다.</p>
<blockquote>💡 <strong>핵심 메시지</strong>: "코드는 작성하는 것보다 읽히는 시간이 훨씬 많다."</blockquote>

<h2>2. 리팩터링 2판 — Martin Fowler</h2>
<p>기존 코드를 어떻게 개선할 수 있는지 구체적인 기법들을 소개합니다. 레거시 코드를 다루는 개발자에게 특히 유용합니다. 초판과 달리 2판은 JavaScript로 예제가 작성되어 있어 프론트엔드 개발자에게도 접근하기 쉽습니다.</p>

<h2>3. 오브젝트 — 조영호</h2>
<p>국내 개발자가 쓴 객체지향 설계 책으로, 이론보다 실질적인 코드 예시를 통해 객체지향의 본질을 설명합니다. 한국어로 쓰인 개발서 중 손에 꼽힐 만큼 탁월한 책입니다.</p>
<blockquote>💡 Java 예제지만 언어에 관계없이 적용할 수 있는 설계 원칙을 다룹니다.</blockquote>

<h2>4. 실용주의 프로그래머 — David Thomas, Andrew Hunt</h2>
<p>기술적인 내용보다는 개발자로서의 태도, 습관, 커리어에 대한 이야기를 담고 있습니다. "DRY 원칙"을 비롯한 수많은 개발 원칙들이 이 책에서 나왔습니다.</p>

<h2>5. 함께 자라기 — 김창준</h2>
<p>애자일 코치 김창준 님이 쓴 책으로, 개인과 팀이 함께 성장하는 방법에 대해 다룹니다. 기술서가 아닌 성장서에 가깝지만, 개발자로서 장기적으로 성장하고 싶다면 꼭 읽어보시길 권합니다.</p>

<h2>마치며</h2>
<p>책을 읽는 것만으로는 부족합니다. 읽으면서 실제 코드에 적용해보고, 동료와 토론하며 내 것으로 만드는 과정이 중요합니다. 위 책들이 여러분의 성장에 도움이 되길 바랍니다.</p>
    `,
    relatedIds: [1, 2],
  },
];

export const categories = [
  { name: "전체 글", count: 128 },
  { name: "개발", count: 84 },
  { name: "· React / Next.js", count: 32 },
  { name: "· Python", count: 24 },
  { name: "· DevOps", count: 18 },
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

export const comments = {
  1: [
    { id: 1, author: "프론트짱", authorEmoji: "🧑‍💻", date: "2025.03.12", text: "useTransition 설명이 정말 명확하네요! 덕분에 개념이 잡혔습니다 😊", likes: 12 },
    { id: 2, author: "리액트러버", authorEmoji: "⚡", date: "2025.03.13", text: "Automatic Batching 부분이 제일 유용했어요. 항상 왜 두 번 렌더링되나 했는데 이제 이해했습니다.", likes: 8 },
    { id: 3, author: "코딩초보", authorEmoji: "🌱", date: "2025.03.14", text: "createRoot으로 마이그레이션 하다가 에러 났는데 이 글 보고 해결했어요! 감사합니다 🙏", likes: 5 },
  ],
  2: [
    { id: 4, author: "배포왕", authorEmoji: "🚀", date: "2025.03.08", text: "Vercel 프리뷰 기능 진짜 유용하죠. 팀에서도 쓰고 있는데 리뷰 프로세스가 훨씬 편해졌어요!", likes: 7 },
    { id: 5, author: "풀스택개발자", authorEmoji: "🌊", date: "2025.03.09", text: "환경 변수 설정 부분이 도움이 많이 됐어요. 이전에는 직접 서버에 ssh로 들어가서 설정했는데...", likes: 4 },
  ],
  3: [
    { id: 6, author: "데이터엔지니어", authorEmoji: "🐍", date: "2025.02.28", text: "BeautifulSoup select 문법 예제가 깔끔하네요. 처음 배우는 분들에게 추천하겠습니다!", likes: 15 },
    { id: 7, author: "파이썬좋아", authorEmoji: "🎯", date: "2025.03.01", text: "time.sleep() 빠뜨리고 크롤링하다가 IP 차단 당한 적 있어요 ㅋㅋ 이 부분 꼭 지켜야 합니다!", likes: 22 },
    { id: 8, author: "신입개발자", authorEmoji: "🌱", date: "2025.03.02", text: "실습하면서 따라했는데 잘 됩니다! 다음 포스팅 Playwright 편도 기대되네요 🙌", likes: 9 },
  ],
  4: [
    { id: 9, author: "책벌레개발자", authorEmoji: "📚", date: "2025.02.19", text: "오브젝트 강추합니다! 국내 개발서 중 최고라고 생각해요.", likes: 18 },
    { id: 10, author: "시니어개발자", authorEmoji: "🦊", date: "2025.02.20", text: "함께 자라기도 좋지만 '어떻게 공부할 것인가'도 함께 읽으면 시너지가 좋더라고요.", likes: 11 },
  ],
};
