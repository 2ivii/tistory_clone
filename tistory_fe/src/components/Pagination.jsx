import React, { useState } from "react";

export default function Pagination({ total = 5 }) {
  const [current, setCurrent] = useState(1);

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const btnStyle = (isActive) => ({
    width: 36,
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    borderColor: isActive ? "#ff5733" : "#e8e8e8",
    borderRadius: 4,
    fontSize: 14,
    color: isActive ? "#fff" : "#555",
    background: isActive ? "#ff5733" : "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
      <button
        style={btnStyle(false)}
        onClick={() => setCurrent((p) => Math.max(1, p - 1))}
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          style={btnStyle(p === current)}
          onClick={() => setCurrent(p)}
        >
          {p}
        </button>
      ))}
      <button
        style={btnStyle(false)}
        onClick={() => setCurrent((p) => Math.min(total, p + 1))}
      >
        ›
      </button>
    </div>
  );
}
