import React, { useState } from "react";

export default function PostCard({ post, onNavigate }) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            onClick={() => onNavigate && onNavigate("post", post.id)}
            style={{
                background: "#fff",
                border: "1px solid #e8e8e8",
                borderRadius: 6,
                marginBottom: 20,
                overflow: "hidden",
                cursor: "pointer",
                transition: "box-shadow 0.2s, transform 0.2s",
                boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Thumbnail — API에 thumbnailUrl이 있으면 이미지, 없으면 이모지 배경 */}
            <div
                style={{
                    width: "100%",
                    height: 220,
                    background: post.thumbnailUrl ? "none" : "#f5f5f3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 56,
                    overflow: "hidden",
                }}
            >
                {post.thumbnailUrl ? (
                    <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    post.authorEmoji || "📝"
                )}
            </div>

            {/* Body */}
            <div style={{ padding: 24 }}>
                <div
                    style={{
                        fontSize: 12,
                        color: "#ff5733",
                        fontWeight: 500,
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}
                >
                    {post.category}
                </div>

                <h2
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#191919",
                        marginBottom: 10,
                        lineHeight: 1.4,
                    }}
                >
                    {post.title}
                </h2>

                <p
                    style={{
                        fontSize: 14,
                        color: "#666",
                        lineHeight: 1.7,
                        marginBottom: 16,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {post.excerpt}
                </p>

                {/* Meta */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 13,
                        color: "#aaa",
                        flexWrap: "wrap",
                    }}
                >
                    {/* createdAt → 날짜 포맷 */}
                    <span>
            {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("ko-KR")
                : ""}
          </span>

                    {/* tags — null/undefined 방어 */}
                    {(post.tags ?? []).map((tag) => (
                        <span
                            key={tag}
                            style={{
                                background: "#f5f5f3",
                                color: "#555",
                                padding: "3px 10px",
                                borderRadius: 100,
                                fontSize: 12,
                            }}
                        >
              #{tag}
            </span>
                    ))}

                    <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
                        {/* viewCount, likeCount — null 방어 */}
                        <span>👁 {(post.viewCount ?? 0).toLocaleString()}</span>
                        <span>❤️ {post.likeCount ?? 0}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}