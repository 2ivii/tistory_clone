import React, { useState } from "react";

const navItems = ["전체 글", "개발", "일상", "리뷰", "방명록"];

const styles = {
  header: {
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    padding: "40px 0 0",
    textAlign: "center",
  },
  title: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 28,
    fontWeight: 600,
    color: "#191919",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: "#888",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 0,
    marginTop: 24,
    borderTop: "1px solid #e8e8e8",
  },
};

export default function BlogHeader() {
  const [active, setActive] = useState("전체 글");

  return (
    <div style={styles.header}>
      <h1 style={styles.title}>✏️ 개발자의 일상노트</h1>
      <p style={styles.desc}>코딩, 일상, 그리고 소소한 기록들</p>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            onClick={(e) => { e.preventDefault(); setActive(item); }}
            style={{
              fontSize: 14,
              color: active === item ? "#ff5733" : "#555",
              padding: "12px 20px",
              borderBottom: active === item ? "2px solid #ff5733" : "2px solid transparent",
              transition: "all 0.2s",
              display: "inline-block",
            }}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}
