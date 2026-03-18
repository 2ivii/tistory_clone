import React from "react";

const styles = {
  gnb: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    height: 56,
    display: "flex",
    alignItems: "center",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 20,
    fontWeight: 600,
    color: "#ff5733",
    letterSpacing: "-0.5px",
  },
  logoSpan: { color: "#191919" },
  menu: {
    display: "flex",
    gap: 24,
    listStyle: "none",
  },
  menuLink: {
    fontSize: 14,
    color: "#555",
  },
  right: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  btnLogin: {
    fontSize: 13,
    color: "#555",
    padding: "6px 14px",
    border: "1px solid #ddd",
    borderRadius: 4,
    cursor: "pointer",
    background: "none",
  },
  btnWrite: {
    fontSize: 13,
    color: "#fff",
    background: "#ff5733",
    padding: "6px 16px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
  },
};

export default function GNB({ onNavigate }) {
  return (
    <nav style={styles.gnb}>
      <div style={styles.inner}>
        <button onClick={() => onNavigate("home")} style={{ ...styles.logo, background: "none", border: "none", cursor: "pointer" }}>
          Tis<span style={styles.logoSpan}>tory</span>
        </button>
        <ul style={styles.menu}>
          <li><button onClick={() => onNavigate("home")} style={{ ...styles.menuLink, background: "none", border: "none", cursor: "pointer" }}>블로그홈</button></li>
          <li><a href="#" style={styles.menuLink}>태그</a></li>
          <li><a href="#" style={styles.menuLink}>방명록</a></li>
        </ul>
        <div style={styles.right}>
          <button style={styles.btnLogin} onClick={() => onNavigate("login")}>로그인</button>
          <button style={styles.btnWrite} onClick={() => onNavigate("write")}>글쓰기</button>
        </div>
      </div>
    </nav>
  );
}
