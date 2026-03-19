<div align="center">

# 📝 Tistory Clone

**티스토리를 클론코딩한 풀스택 블로그 플랫폼**

React + Vite 프론트엔드와 Spring Boot 백엔드로 구성된 모노레포입니다.

<br/>

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-4.4-646CFF?style=flat-square&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-0.12.5-000000?style=flat-square&logo=jsonwebtokens)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)

</div>

---
## 🗺 프로젝트 소개

티스토리의 핵심 기능을 직접 구현한 풀스택 블로그 플랫폼입니다. 회원가입부터 글 작성·발행, 댓글까지 실제 서비스에 가까운 흐름을 경험할 수 있도록 설계했습니다.

```
tistory-clone/          ← 프론트엔드 (React + Vite)
tistory-backend/        ← 백엔드 (Spring Boot 3)
README.md
```

---

## ✨ 주요 기능

### 🔐 인증
- 이메일 / 비밀번호 기반 로그인
- JWT Access Token + Refresh Token 이중 인증
- 이메일·닉네임·블로그 주소 실시간 중복 확인
- 로그아웃 시 서버 측 Refresh Token 강제 만료

### 👤 4단계 회원가입 플로우
| 단계 | 내용 |
|------|------|
| 1️⃣ 약관 동의 | 필수·선택 약관 분리, 전체 동의 / 개별 동의 |
| 2️⃣ 기본 정보 | 이메일·비밀번호 강도 측정·닉네임·생년월일·성별·휴대폰 인증 |
| 3️⃣ 블로그 설정 | 블로그 이름·주소·소개·프로필 이모지·테마 선택 |
| 4️⃣ 가입 완료 | 설정 요약 확인 및 첫 글 작성 유도 |

### 📖 게시글
- 리치텍스트 에디터 (굵게·기울임·밑줄·H1~H3·정렬·목록·코드블록)
- 카테고리·태그·공개설정(전체/비공개/보호) 지정
- 임시저장 / 발행 전환
- 조회수 자동 집계
- 글 상세: 읽기 진행 바·자동 목차(TOC)·이전·다음 글 네비게이션

### 💬 댓글
- 댓글 작성 및 좋아요
- 신규 댓글 즉시 UI 반영

### 🔍 검색 & 탐색
- 키워드 전문 검색
- 태그 기반 검색
- 카테고리 필터링
- 블로그 별 글 목록 조회

---

## 🛠 기술 스택

### Frontend
| 구분 | 기술 |
|------|------|
| 언어 | JavaScript (ES2022+) |
| 프레임워크 | React 18.2 |
| 번들러 | Vite 4.4 |
| 스타일링 | CSS-in-JS (Inline Styles) |
| 라우팅 | 자체 구현 (useState 기반 SPA) |
| 폰트 | Noto Sans KR (Google Fonts) |

### Backend
| 구분 | 기술 |
|------|------|
| 언어 | Java 17 |
| 프레임워크 | Spring Boot 3.2.4 |
| 보안 | Spring Security + JWT (jjwt 0.12.5) |
| ORM | Spring Data JPA + Hibernate |
| 데이터베이스 | MySQL 8 |
| 빌드 | Maven |
| 유틸리티 | Lombok, Bean Validation |

---

## 📁 프로젝트 구조

```
📦 tistory-clone (Frontend)
 ├── src/
 │   ├── App.jsx                    # 루트 컴포넌트 + 클라이언트 라우팅
 │   ├── main.jsx                   # 진입점
 │   ├── components/
 │   │   ├── GNB.jsx                # 상단 글로벌 네비게이션 바
 │   │   ├── BlogHeader.jsx         # 블로그 타이틀 + 탭 메뉴
 │   │   ├── PostCard.jsx           # 게시글 목록 카드
 │   │   ├── Sidebar.jsx            # 프로필·카테고리·태그 사이드바
 │   │   ├── Pagination.jsx         # 페이지네이션
 │   │   └── Footer.jsx             # 하단 푸터
 │   ├── pages/
 │   │   ├── LoginPage.jsx          # 로그인 (이메일·카카오 탭)
 │   │   ├── SignupPage.jsx         # 4단계 회원가입
 │   │   ├── WritePage.jsx          # 글쓰기 에디터
 │   │   └── PostDetailPage.jsx     # 게시글 상세 (TOC·댓글·관련글)
 │   ├── data/
 │   │   └── posts.js               # 목업 데이터 (개발용)
 │   └── styles/
 │       └── global.css             # 전역 스타일
 ├── index.html
 ├── vite.config.js
 └── package.json

📦 tistory-backend (Backend)
 └── src/main/java/com/tistory/blog/
     ├── BlogApplication.java       # 메인 진입점
     ├── config/
     │   ├── SecurityConfig.java    # Spring Security + CORS
     │   └── DataInitializer.java   # 개발용 샘플 데이터 자동 삽입
     ├── controller/
     │   ├── AuthController.java    # POST /api/auth/**
     │   ├── PostController.java    # /api/posts/**
     │   └── BlogController.java    # /api/blogs/**, /api/members/**
     ├── service/
     │   ├── AuthService.java       # 회원가입·로그인·토큰 재발급
     │   ├── PostService.java       # 게시글 CRUD·검색
     │   └── MemberService.java     # 회원 프로필·블로그 설정
     ├── entity/
     │   ├── Member.java
     │   ├── Post.java
     │   ├── RefreshToken.java
     │   └── BaseTimeEntity.java    # createdAt·updatedAt Auditing
     ├── dto/
     │   ├── request/               # 요청 DTO (Bean Validation 포함)
     │   └── response/              # 응답 DTO
     ├── repository/                # Spring Data JPA
     ├── security/
     │   ├── JwtTokenProvider.java  # 토큰 생성·검증
     │   └── JwtAuthenticationFilter.java
     └── exception/                 # 커스텀 예외 + GlobalExceptionHandler
```

---


## 📡 API 명세

### 공통 응답 형식

```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

### 인증 `POST /api/auth`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| `POST` | `/api/auth/signup` | 회원가입 | ❌ |
| `POST` | `/api/auth/login` | 로그인 | ❌ |
| `POST` | `/api/auth/refresh` | 토큰 재발급 | ❌ |
| `POST` | `/api/auth/logout` | 로그아웃 | ✅ |
| `GET`  | `/api/auth/check/email` | 이메일 중복 확인 | ❌ |
| `GET`  | `/api/auth/check/nickname` | 닉네임 중복 확인 | ❌ |
| `GET`  | `/api/auth/check/blog-address` | 블로그 주소 중복 확인 | ❌ |

#### 회원가입 요청 예시

```json
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "Test1234!",
  "nickname": "개발자K",
  "phone": "010-1234-5678",
  "gender": "남성",
  "birthDate": "1995-06-15",
  "blogTitle": "개발자의 일상노트",
  "blogAddress": "devk-blog",
  "blogDescription": "코딩과 일상을 기록합니다.",
  "profileEmoji": "👩‍💻",
  "theme": "light",
  "agreedService": true,
  "agreedPrivacy": true,
  "agreedLocation": false,
  "agreedMarketing": false
}
```

### 게시글 `/api/posts`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| `GET` | `/api/posts` | 전체 공개 글 목록 (페이징) | ❌ |
| `GET` | `/api/posts/{id}` | 글 단건 조회 + 조회수 증가 | ❌ |
| `GET` | `/api/posts/search?keyword=` | 키워드 검색 | ❌ |
| `GET` | `/api/posts/tag/{tag}` | 태그 검색 | ❌ |
| `POST` | `/api/posts` | 글 작성 | ✅ |
| `PUT` | `/api/posts/{id}` | 글 수정 | ✅ |
| `DELETE` | `/api/posts/{id}` | 글 삭제 | ✅ |
| `PATCH` | `/api/posts/{id}/publish` | 발행·임시저장 전환 | ✅ |
| `GET` | `/api/posts/drafts` | 임시저장 목록 | ✅ |

#### 글 작성 요청 예시

```json
POST /api/posts
Authorization: Bearer {accessToken}
{
  "title": "React 18 정리",
  "content": "<h2>개요</h2><p>React 18은...</p>",
  "category": "React / Next.js",
  "visibility": "PUBLIC",
  "published": true,
  "tags": ["React", "프론트엔드"]
}
```

### 블로그 & 회원

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| `GET` | `/api/blogs/{blogAddress}` | 블로그 프로필 조회 | ❌ |
| `GET` | `/api/blogs/{blogAddress}/posts` | 블로그 글 목록 | ❌ |
| `GET` | `/api/members/me` | 내 정보 조회 | ✅ |
| `PATCH` | `/api/members/me/blog` | 블로그 설정 수정 | ✅ |

---

## 🖥 화면 구성

| 페이지 | 경로 (state) | 설명 |
|--------|-------------|------|
| 홈 | `home` | 게시글 목록 + 사이드바 |
| 로그인 | `login` | 이메일 / 카카오 탭 전환 |
| 회원가입 | `signup` | 약관·기본정보·블로그설정·완료 4단계 |
| 글쓰기 | `write` | 리치텍스트 에디터 + 발행 설정 |
| 글 상세 | `post` | 본문·TOC·댓글·관련글·이전·다음 |

---
