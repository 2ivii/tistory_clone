import React from "react";

const links = ["공지사항", "고객센터", "이용약관", "개인정보처리방침", "블로그 개설"];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#fff",
        borderTop: "1px solid #e8e8e8",
        padding: "32px 0",
        marginTop: 60,
        textAlign: "center",
        fontSize: 13,
        color: "#aaa",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 12 }}>
        {links.map((link) => (
          <a key={link} href="#" style={{ color: "#888" }}>
            {link}
          </a>
        ))}
      </div>
      <p>© 2025 Tistory Clone. Kakao Corp.</p>
    </footer>
  );
}
