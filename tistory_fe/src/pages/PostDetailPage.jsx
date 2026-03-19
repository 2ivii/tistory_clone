import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";

/* ─── 스타일 상수 ─── */
const font = "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";
const accent = "#ff5733";

/* ─── TOC 파싱 ─── */
function parseToc(html) {
  if (!html) return [];
  const matches = [...html.matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/gi)];
  return matches.map((m, i) => ({
    id: `heading-${i}`,
    level: parseInt(m[1]),
    text: m[2].replace(/<[^>]*>/g, ""),
  }));
}

/* ─── HTML에 id 주입 ─── */
function injectIds(html) {
  if (!html) return "";
  let i = 0;
  return html.replace(/<h([23])([^>]*)>/gi, (_, level, attrs) => {
    return `<h${level}${attrs} id="heading-${i++}">`;
  });
}

/* ─── TableOfContents ─── */
function TableOfContents({ toc, activeId }) {
  if (toc.length === 0) return null;
  return (
      <nav style={{
        position: "sticky", top: 80,
        background: "#fafaf8", border: "1px solid #ece9e4",
        borderRadius: 10, padding: "18px 20px",
        fontSize: 13, marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", letterSpacing: 1, marginBottom: 12, textTransform: "uppercase" }}>
          목차
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {toc.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`}
                   style={{
                     display: "block",
                     padding: "4px 0 4px",
                     paddingLeft: item.level === 3 ? 14 : 0,
                     fontSize: item.level === 3 ? 12 : 13,
                     color: activeId === item.id ? accent : item.level === 3 ? "#888" : "#555",
                     fontWeight: activeId === item.id ? 700 : 400,
                     textDecoration: "none",
                     borderLeft: activeId === item.id ? `2px solid ${accent}` : "2px solid transparent",
                     transition: "all 0.15s",
                     lineHeight: 1.4,
                   }}
                >
                  {item.text}
                </a>
              </li>
          ))}
        </ul>
      </nav>
  );
}

/* ─── CommentItem ─── */
function CommentItem({ comment }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);

  return (
      <div style={{
        display: "flex", gap: 14, padding: "20px 0",
        borderBottom: "1px solid #f0ede8",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          background: "#f0ede8", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 20,
        }}>
          {comment.authorEmoji || "👤"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#191919" }}>{comment.author}</span>
            <span style={{ fontSize: 12, color: "#bbb" }}>{comment.date}</span>
          </div>
          <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 }}>{comment.text}</p>
          <button
              onClick={() => { setLiked(v => !v); setLikeCount(c => liked ? c - 1 : c + 1); }}
              style={{
                marginTop: 8, background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: liked ? accent : "#bbb",
                display: "flex", alignItems: "center", gap: 4, padding: 0,
                fontFamily: font, transition: "color 0.15s",
              }}
          >
            {liked ? "❤️" : "🤍"} 도움이 됐어요 {likeCount}
          </button>
        </div>
      </div>
  );
}

/* ─── CommentForm ─── */
function CommentForm({ onSubmit }) {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !name.trim()) return;
    onSubmit({ author: name, text });
    setText("");
    setName("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputStyle = {
    width: "100%", height: 44, padding: "0 14px",
    border: "1px solid #e0ddd8", borderRadius: 8,
    fontSize: 14, color: "#191919", outline: "none",
    fontFamily: font, background: "#fff",
    boxSizing: "border-box",
  };

  return (
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#191919" }}>댓글 남기기</h3>
        {submitted && (
            <div style={{ background: "#f0fff4", border: "1px solid #c6f6d5", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#276749" }}>
              ✅ 댓글이 등록되었습니다!
            </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
              placeholder="닉네임"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...inputStyle, maxWidth: 200 }}
          />
          <textarea
              placeholder="댓글을 입력하세요..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              style={{
                ...inputStyle, height: "auto", padding: "12px 14px",
                resize: "vertical", lineHeight: 1.6,
              }}
          />
          <button
              type="submit"
              style={{
                alignSelf: "flex-end",
                padding: "10px 24px",
                background: text.trim() && name.trim() ? accent : "#e0ddd8",
                color: "#fff", fontSize: 14, fontWeight: 700,
                border: "none", borderRadius: 8, cursor: "pointer",
                fontFamily: font, transition: "background 0.2s",
              }}
          >
            댓글 등록
          </button>
        </form>
      </div>
  );
}

/* ─── 메인 컴포넌트 ─── */
export default function PostDetailPage({ postId, onNavigate }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [localComments, setLocalComments] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);

  // API 연결: 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${postId}`);
        const data = response.data.data;
        setPost(data);
        setLikeCount(data.likeCount);
        // BE에 댓글 기능이 아직 구현되지 않았으므로 빈 배열로 설정
        setLocalComments([]);
      } catch (error) {
        alert("게시글을 불러오는 데 실패했습니다.");
        onNavigate("home");
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  /* 스크롤 진행률 + 활성 헤딩 */
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);

      const headings = document.querySelectorAll("h2[id], h3[id]");
      let current = "";
      headings.forEach(h => {
        if (h.getBoundingClientRect().top <= 120) current = h.id;
      });
      setActiveHeading(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <div style={{ padding: "100px", textAlign: "center" }}>로딩 중...</div>;
  if (!post) return null;

  const toc = parseToc(post.content);
  const injectedContent = injectIds(post.content);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = ({ author, text }) => {
    setLocalComments(prev => [...prev, {
      id: Date.now(),
      author,
      authorEmoji: "🙂",
      date: new Date().toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(".", ""),
      text,
      likes: 0,
    }]);
  };

  return (
      <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: font }}>

        {/* 읽기 진행 바 */}
        <div style={{
          position: "fixed", top: 0, left: 0, zIndex: 200,
          height: 3, background: accent,
          width: `${scrollProgress}%`, transition: "width 0.1s linear",
        }} />

        {/* ── 히어로 헤더 ── */}
        <div style={{
          background: "#fff3f0", // API 연동 시 배경색을 하나로 통일하거나 BE에서 받아온 색상 적용
          paddingTop: 72,
          position: "relative", overflow: "hidden",
        }}>
          {/* 배경 이모지 워터마크 */}
          <div style={{
            position: "absolute", right: "8%", top: "50%",
            transform: "translateY(-50%)",
            fontSize: 180, opacity: 0.12,
            pointerEvents: "none", userSelect: "none",
          }}>
            {post.authorEmoji || "📝"}
          </div>

          <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 32px 48px" }}>
            <div style={{ marginBottom: 16 }}>
              <button
                  onClick={() => onNavigate("home")}
                  style={{
                    background: "none", border: `1px solid ${accent}`,
                    borderRadius: 100, padding: "4px 14px",
                    fontSize: 12, color: accent, fontWeight: 600,
                    cursor: "pointer", fontFamily: font,
                    letterSpacing: "0.5px", textTransform: "uppercase",
                  }}
              >
                {post.category || "전체"}
              </button>
            </div>

            <h1 style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 800, color: "#191919",
              lineHeight: 1.35, marginBottom: 20,
              letterSpacing: "-0.5px",
            }}>{post.title}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(255,255,255,0.8)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {post.authorEmoji || "👤"}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{post.authorNickname}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ width: 1, height: 28, background: "rgba(0,0,0,0.1)" }} />
              <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#777" }}>
                <span>👁 {post.viewCount?.toLocaleString()}</span>
                <span>💬 {localComments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 본문 레이아웃 ── */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "1fr 240px", gap: 40, alignItems: "start" }}>

          {/* 왼쪽: 본문 */}
          <div>
            <article
                ref={contentRef}
                style={{
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #ece9e4",
                  padding: "44px 48px",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                }}
            >
              <div
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: injectedContent }}
              />

              {/* 태그 */}
              <div style={{ borderTop: "1px solid #f0ede8", marginTop: 40, paddingTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {post.tags?.map(tag => (
                    <span key={tag} style={{
                      background: "#fff3f0", color: accent,
                      borderRadius: 100, padding: "5px 14px",
                      fontSize: 13, fontWeight: 500, cursor: "pointer",
                    }}>
                  #{tag}
                </span>
                ))}
              </div>
            </article>

            {/* 반응 바 */}
            <div style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #ece9e4",
              padding: "20px 28px", marginTop: 20,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              flexWrap: "wrap", gap: 16,
            }}>
              <button
                  onClick={() => { setLiked(v => !v); setLikeCount(c => liked ? c - 1 : c + 1); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 22px",
                    background: liked ? "#fff3f0" : "#f8f7f4",
                    border: `1.5px solid ${liked ? accent : "#e0ddd8"}`,
                    borderRadius: 100, cursor: "pointer",
                    fontFamily: font, transition: "all 0.2s",
                  }}
              >
                <span style={{ fontSize: 20 }}>{liked ? "❤️" : "🤍"}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: liked ? accent : "#888" }}>
                도움이 됐어요 {likeCount}
              </span>
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "URL 복사", icon: copied ? "✅" : "🔗", action: handleCopyLink },
                ].map(btn => (
                    <button key={btn.label}
                            onClick={btn.action}
                            style={{
                              width: 40, height: 40,
                              background: "#f8f7f4", border: "1px solid #e0ddd8",
                              borderRadius: "50%", cursor: "pointer",
                              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                    >
                      {btn.icon}
                    </button>
                ))}
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div style={{
              background: "#fff", borderRadius: 14,
              border: "1px solid #ece9e4",
              padding: "32px 40px", marginTop: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#191919", marginBottom: 4 }}>
                댓글 <span style={{ color: accent }}>{localComments.length}</span>
              </h2>
              <div>
                {localComments.map(c => <CommentItem key={c.id} comment={c} />)}
              </div>
              <CommentForm onSubmit={handleAddComment} />
            </div>
          </div>

          {/* 오른쪽: 사이드바 (목차) */}
          <aside>
            <TableOfContents toc={toc} activeId={activeHeading} />
            <button
                onClick={() => onNavigate("home")}
                style={{
                  width: "100%", padding: "12px",
                  background: "#fff", border: "1px solid #ece9e4",
                  borderRadius: 8, cursor: "pointer",
                  fontFamily: font, fontSize: 13,
                  color: "#666", fontWeight: 500,
                }}
            >
              ← 목록으로
            </button>
          </aside>
        </div>

        <style>{`
        .post-content { font-size: 16px; line-height: 1.9; color: #2d2d2d; }
        .post-content h2 {
          font-size: 22px; font-weight: 800; color: #191919;
          margin: 44px 0 16px; padding-bottom: 10px;
          border-bottom: 2px solid #f0ede8;
          scroll-margin-top: 100px;
        }
        .post-content h3 {
          font-size: 18px; font-weight: 700; color: #333;
          margin: 32px 0 12px;
          scroll-margin-top: 100px;
        }
        .post-content p { margin: 0 0 18px; }
        .post-content code {
          background: #f5f2ef; color: #c0392b;
          padding: 2px 7px; border-radius: 4px;
          font-size: 14px;
        }
        .post-content pre {
          background: #1e1e2e; color: #cdd6f4;
          border-radius: 10px; padding: 22px 24px;
          overflow-x: auto; margin: 0 0 24px;
          font-size: 14px;
        }
      `}</style>
      </div>
  );
}