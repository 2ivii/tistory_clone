import React from "react";
import GNB from "./components/GNB";
import BlogHeader from "./components/BlogHeader";
import PostCard from "./components/PostCard";
import Sidebar from "./components/Sidebar";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";
import { posts } from "./data/posts";
import "./styles/global.css";

export default function App() {
  return (
    <>
      <GNB />
      <BlogHeader />

      {/* Main Layout */}
      <div
        style={{
          maxWidth: 1100,
          margin: "40px auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 40,
        }}
      >
        {/* Post List */}
        <main>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          <Pagination total={5} />
        </main>

        {/* Sidebar */}
        <Sidebar />
      </div>

      <Footer />
    </>
  );
}
