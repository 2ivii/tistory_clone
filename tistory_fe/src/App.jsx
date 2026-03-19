import React, { useState } from "react";
import GNB from "./components/GNB";
import BlogHeader from "./components/BlogHeader";
import PostCard from "./components/PostCard";
import Sidebar from "./components/Sidebar";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import WritePage from "./pages/WritePage";
import SignupPage from "./pages/SignupPage";
import PostDetailPage from "./pages/PostDetailPage";
import { posts } from "./data/posts";
import "./styles/global.css";

export default function App() {
  // page: "home" | "login" | "write" | "signup" | "post"
  const [page, setPage]       = useState("home");
  const [postId, setPostId]   = useState(null);

  const handleNavigate = (target, id = null) => {
    setPage(target);
    if (id !== null) setPostId(id);
    window.scrollTo(0, 0);
  };

  if (page === "login")  return <LoginPage      onNavigate={handleNavigate} />;
  if (page === "write")  return <WritePage       onNavigate={handleNavigate} />;
  if (page === "signup") return <SignupPage      onNavigate={handleNavigate} />;
  if (page === "post")   return (
    <>
      <GNB onNavigate={handleNavigate} />
      <PostDetailPage postId={postId} onNavigate={handleNavigate} />
      <Footer />
    </>
  );

  return (
    <>
      <GNB onNavigate={handleNavigate} />
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
            <PostCard key={post.id} post={post} onNavigate={handleNavigate} />
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
