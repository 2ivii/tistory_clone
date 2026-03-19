import React, { useState, useEffect } from "react";
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
import api from "./api/axios";
import "./styles/global.css";

export default function App() {
    // page: "home" | "login" | "write" | "signup" | "post"
    const [page, setPage]     = useState("home");
    const [postId, setPostId] = useState(null);

    // 게시글 목록 상태
    const [posts, setPosts]         = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(0); // BE는 0-indexed
    const [loadingPosts, setLoadingPosts] = useState(false);

    const handleNavigate = (target, id = null) => {
        setPage(target);
        if (id !== null) setPostId(id);
        window.scrollTo(0, 0);
    };

    // 홈 화면일 때 게시글 목록 API 호출
    useEffect(() => {
        if (page !== "home") return;

        const fetchPosts = async () => {
            setLoadingPosts(true);
            try {
                // GET /api/posts?page=0&size=10
                const response = await api.get("/posts", {
                    params: { page: currentPage, size: 10 },
                });
                const pageData = response.data.data;
                setPosts(pageData.content);           // Page<PostSummaryResponse>.content
                setTotalPages(pageData.totalPages);   // 전체 페이지 수
            } catch (error) {
                console.error("게시글 목록 로드 실패:", error);
                setPosts([]);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [page, currentPage]); // 페이지 이동 시 재호출

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage - 1); // Pagination 컴포넌트는 1-indexed, BE는 0-indexed
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
                    {loadingPosts ? (
                        <div style={{
                            textAlign: "center",
                            padding: "80px 0",
                            color: "#aaa",
                            fontSize: 15,
                            fontFamily: "'Noto Sans KR', sans-serif",
                        }}>
                            게시글을 불러오는 중...
                        </div>
                    ) : posts.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "80px 0",
                            color: "#aaa",
                            fontSize: 15,
                            fontFamily: "'Noto Sans KR', sans-serif",
                        }}>
                            아직 게시글이 없습니다.
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} onNavigate={handleNavigate} />
                        ))
                    )}
                    <Pagination
                        total={totalPages}
                        current={currentPage + 1}  // BE 0-indexed → UI 1-indexed
                        onPageChange={handlePageChange}
                    />
                </main>

                {/* Sidebar */}
                <Sidebar />
            </div>

            <Footer />
        </>
    );
}