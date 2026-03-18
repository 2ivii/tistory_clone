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
import { posts } from "./data/posts";
import "./styles/global.css";

export default function App() {
  const [page, setPage] = useState("home"); // "home" | "login" | "write"

  if (page === "login") return <LoginPage onNavigate={setPage} />;
  if (page === "write") return <WritePage onNavigate={setPage} />;
  if (page === "signup") return <SignupPage onNavigate={setPage} />;

  return (
    <>
      <GNB onNavigate={setPage} />
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
