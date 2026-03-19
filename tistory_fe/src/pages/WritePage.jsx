import React, { useState, useRef } from "react";
import api from "../api/axios";

const TOOLBAR_GROUPS = [
  [
    { icon: "B", title: "굵게", action: "bold", style: { fontWeight: 700 } },
    { icon: "I", title: "기울임", action: "italic", style: { fontStyle: "italic" } },
    { icon: "U", title: "밑줄", action: "underline", style: { textDecoration: "underline" } },
    { icon: "S", title: "취소선", action: "strikethrough", style: { textDecoration: "line-through" } },
  ],
  [
    { icon: "H1", title: "제목1", action: "h1" },
    { icon: "H2", title: "제목2", action: "h2" },
    { icon: "H3", title: "제목3", action: "h3" },
  ],
  [
    { icon: "≡", title: "좌측 정렬", action: "justifyLeft" },
    { icon: "≡", title: "가운데 정렬", action: "justifyCenter" },
    { icon: "≡", title: "우측 정렬", action: "justifyRight" },
  ],
  [
    { icon: "• —", title: "순서 없는 목록", action: "insertUnorderedList" },
    { icon: "1.", title: "순서 목록", action: "insertOrderedList" },
  ],
  [
    { icon: "🔗", title: "링크", action: "link" },
    { icon: "🖼", title: "이미지", action: "image" },
    { icon: "< >", title: "코드블록", action: "code" },
  ],
];

const CATEGORIES = ["개발", "일상", "리뷰", "React / Next.js", "Python", "DevOps"];

export default function WritePage({ onNavigate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isSaved, setIsSaved] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  const execCmd = (action) => {
    if (["h1", "h2", "h3"].includes(action)) {
      document.execCommand("formatBlock", false, action);
    } else if (action === "code") {
      document.execCommand("formatBlock", false, "pre");
    } else {
      document.execCommand(action, false, null);
    }
    editorRef.current?.focus();
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleEditorInput = () => {
    const text = editorRef.current?.innerText || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
  };

  // API 연동: 서버에 게시글 데이터 전송
  const handleSubmit = async (published) => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    const content = editorRef.current?.innerHTML || "";
    if (!content.trim() || content === "<br>") {
      alert("내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 백엔드 PostCreateRequest DTO 구조에 맞춤
      await api.post("/posts", {
        title,
        content,
        category,
        visibility: visibility.toUpperCase(), // BE Enum: PUBLIC, PRIVATE, PASSWORD
        published: published,
        tags: tags,
        thumbnailUrl: "" // 현재 UI에 파일 업로드 기능이 없으므로 빈 문자열 전송
      });

      if (published) {
        setIsPublished(true);
        setTimeout(() => onNavigate("home"), 1500);
      } else {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || "글 저장에 실패했습니다.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => handleSubmit(false);
  const handlePublish = () => handleSubmit(true);

  const btnBase = {
    height: 36,
    padding: "0 16px",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "'Noto Sans KR', sans-serif",
    transition: "all 0.2s",
    border: "1px solid #ddd",
  };

  return (
      <div style={{ minHeight: "100vh", background: "#f8f8f6", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid #e8e8e8",
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
        }}>
          <button
              onClick={() => onNavigate("home")}
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 18,
                fontWeight: 600,
                color: "#ff5733",
                background: "none",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
              }}
          >
            Tis<span style={{ color: "#191919" }}>tory</span>
          </button>

          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#aaa" }}>
            {isSaved ? "✅ 임시저장 완료" : isPublished ? "🎉 발행 완료!" : `${wordCount}단어`}
          </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
                onClick={handleSave}
                disabled={loading}
                style={{ ...btnBase, color: "#555", background: "#fff" }}
                onMouseEnter={(e) => (e.target.style.background = "#f5f5f3")}
                onMouseLeave={(e) => (e.target.style.background = "#fff")}
            >
              임시저장
            </button>
            <button
                onClick={handlePublish}
                disabled={loading}
                style={{
                  ...btnBase,
                  background: "#ff5733",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  padding: "0 20px",
                }}
            >
              {loading ? "처리 중..." : "발행"}
            </button>
          </div>
        </header>

        <div style={{
          flex: 1,
          maxWidth: 900,
          width: "100%",
          margin: "32px auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>

          {/* Editor Card */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            {/* Title */}
            <div style={{ padding: "32px 40px 0" }}>
              <input
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#191919",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    background: "transparent",
                    padding: 0,
                    letterSpacing: "-0.5px",
                  }}
              />
              <div style={{
                height: 1,
                background: "#f0f0f0",
                margin: "20px 0 0",
              }} />
            </div>

            {/* Toolbar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "10px 40px",
              borderBottom: "1px solid #f0f0f0",
              flexWrap: "wrap",
              background: "#fafafa",
            }}>
              {TOOLBAR_GROUPS.map((group, gi) => (
                  <React.Fragment key={gi}>
                    {gi > 0 && (
                        <div style={{ width: 1, height: 20, background: "#e0e0e0", margin: "0 4px" }} />
                    )}
                    {group.map(({ icon, title: t, action }) => (
                        <button
                            key={action}
                            title={t}
                            onMouseDown={(e) => { e.preventDefault(); execCmd(action); }}
                            style={{
                              width: action === "h1" || action === "h2" || action === "h3" || action === "code" ? "auto" : 32,
                              height: 32,
                              padding: "0 8px",
                              background: "none",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontSize: action === "bold" ? 15 : 13,
                              color: "#555",
                              fontWeight: action === "bold" ? 700 : 400,
                              fontStyle: action === "italic" ? "italic" : "normal",
                              fontFamily: "'Noto Sans KR', sans-serif",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#efefef")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                          {icon}
                        </button>
                    ))}
                  </React.Fragment>
              ))}
            </div>

            {/* Content Editable */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                data-placeholder="내용을 입력하세요..."
                style={{
                  minHeight: 480,
                  padding: "28px 40px 40px",
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: "#333",
                  outline: "none",
                  fontFamily: "'Noto Sans KR', sans-serif",
                }}
            />
          </div>

          {/* Settings Card */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 10,
            padding: "28px 40px",
            marginTop: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#191919", marginBottom: 20 }}>발행 설정</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* Category */}
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 8 }}>
                  카테고리
                </label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 12px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontSize: 14,
                      color: category ? "#191919" : "#aaa",
                      background: "#fff",
                      fontFamily: "'Noto Sans KR', sans-serif",
                      cursor: "pointer",
                      outline: "none",
                    }}
                >
                  <option value="">카테고리 선택</option>
                  {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Visibility */}
              <div>
                <label style={{ display: "block", fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 8 }}>
                  공개 설정
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["public", "🌍 전체 공개"], ["private", "🔒 비공개"], ["password", "🔑 보호"]].map(([val, label]) => (
                      <button
                          key={val}
                          onClick={() => setVisibility(val)}
                          style={{
                            flex: 1,
                            height: 44,
                            border: "1px solid",
                            borderColor: visibility === val ? "#ff5733" : "#ddd",
                            borderRadius: 6,
                            background: visibility === val ? "#fff6f4" : "#fff",
                            color: visibility === val ? "#ff5733" : "#666",
                            fontSize: 12,
                            fontWeight: visibility === val ? 700 : 400,
                            cursor: "pointer",
                            fontFamily: "'Noto Sans KR', sans-serif",
                            transition: "all 0.2s",
                          }}
                      >
                        {label}
                      </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginTop: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 8 }}>
                태그 <span style={{ color: "#aaa", fontWeight: 400 }}>(Enter 또는 쉼표로 추가, 최대 10개)</span>
              </label>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: "10px 12px",
                minHeight: 48,
                cursor: "text",
              }}
                   onClick={() => document.getElementById("tag-input")?.focus()}
              >
                {tags.map((tag) => (
                    <span
                        key={tag}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#fff3f0",
                          color: "#ff5733",
                          borderRadius: 100,
                          padding: "3px 10px 3px 12px",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                    >
                  #{tag}
                      <button
                          onClick={(e) => { e.stopPropagation(); setTags(tags.filter((t) => t !== tag)); }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#ff9080",
                            fontSize: 14,
                            lineHeight: 1,
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                      >
                    ×
                  </button>
                </span>
                ))}
                {tags.length < 10 && (
                    <input
                        id="tag-input"
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder={tags.length === 0 ? "태그를 입력하세요" : ""}
                        style={{
                          border: "none",
                          outline: "none",
                          fontSize: 14,
                          color: "#333",
                          fontFamily: "'Noto Sans KR', sans-serif",
                          minWidth: 120,
                          flex: 1,
                          background: "transparent",
                        }}
                    />
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div style={{ marginTop: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: "#555", fontWeight: 500, marginBottom: 8 }}>
                대표 이미지
              </label>
              <div style={{
                border: "1.5px dashed #ddd",
                borderRadius: 8,
                height: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
                background: "#fafafa",
              }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.borderColor = "#ff5733";
                     e.currentTarget.style.background = "#fff8f6";
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.borderColor = "#ddd";
                     e.currentTarget.style.background = "#fafafa";
                   }}
              >
                <span style={{ fontSize: 28 }}>🖼</span>
                <span style={{ fontSize: 13, color: "#aaa" }}>클릭하여 이미지 업로드</span>
                <span style={{ fontSize: 12, color: "#ccc" }}>JPG, PNG, GIF (최대 10MB)</span>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #f0f0f0",
            }}>
              <button
                  onClick={() => onNavigate("home")}
                  style={{ ...btnBase, color: "#666", background: "#fff", padding: "0 20px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f3")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                취소
              </button>
              <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{ ...btnBase, color: "#555", background: "#fff", padding: "0 20px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f3")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                임시저장
              </button>
              <button
                  onClick={handlePublish}
                  disabled={loading || isPublished}
                  style={{
                    ...btnBase,
                    background: isPublished ? "#ccc" : "#ff5733",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    padding: "0 28px",
                  }}
              >
                {isPublished ? "발행 완료! 🎉" : "발행하기"}
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder CSS for contenteditable */}
        <style>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #ccc;
          pointer-events: none;
        }
      `}</style>
      </div>
  );
}