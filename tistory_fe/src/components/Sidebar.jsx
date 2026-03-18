import React from "react";
import { categories, recentComments, tags } from "../data/posts";

function SidebarBox({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#191919",
          padding: "16px 20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside style={{ minWidth: 0 }}>
      {/* Profile */}
      <SidebarBox title="">
        <div style={{ padding: 24, textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff5733, #ff9500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              margin: "0 auto 12px",
            }}
          >
            K
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>개발자 K</div>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
            프론트엔드 개발자.<br />코드와 커피를 좋아합니다 ☕
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {[["128", "포스트"], ["4.2K", "구독자"], ["18K", "방문자"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{num}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </SidebarBox>

      {/* Category */}
      <SidebarBox title="카테고리">
        <ul style={{ listStyle: "none" }}>
          {categories.map((cat) => (
            <li key={cat.name}>
              <a
                href="#"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "11px 20px",
                  fontSize: 14,
                  color: "#444",
                  borderBottom: "1px solid #f8f8f8",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf5f3")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span>{cat.name}</span>
                <span
                  style={{
                    background: "#f5f5f3",
                    color: "#999",
                    padding: "2px 8px",
                    borderRadius: 100,
                    fontSize: 12,
                  }}
                >
                  {cat.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </SidebarBox>

      {/* Recent Comments */}
      <SidebarBox title="최근 댓글">
        <ul style={{ listStyle: "none" }}>
          {recentComments.map((c, i) => (
            <li key={i}>
              <a
                href="#"
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 20px",
                  borderBottom: "1px solid #f8f8f8",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf5f3")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 4,
                    background: "#f0ede8",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  💬
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#333",
                      fontWeight: 500,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.4,
                      marginBottom: 4,
                    }}
                  >
                    {c.text}
                  </div>
                  <div style={{ fontSize: 12, color: "#bbb" }}>{c.date}</div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </SidebarBox>

      {/* Tags */}
      <SidebarBox title="태그">
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {tags.map((tag) => (
            <a
              key={tag}
              href="#"
              style={{
                background: "#f5f5f3",
                color: "#555",
                padding: "4px 12px",
                borderRadius: 100,
                fontSize: 13,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ff5733";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f5f5f3";
                e.currentTarget.style.color = "#555";
              }}
            >
              #{tag}
            </a>
          ))}
        </div>
      </SidebarBox>
    </aside>
  );
}
