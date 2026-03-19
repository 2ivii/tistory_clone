package com.tistory.blog.repository;

import com.tistory.blog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 공개 게시글 전체 목록 (페이징)
    Page<Post> findByVisibilityAndPublishedTrue(Post.Visibility visibility, Pageable pageable);

    // 특정 블로그 게시글 목록
    Page<Post> findByMemberIdAndPublishedTrue(Long memberId, Pageable pageable);

    // 카테고리 필터
    Page<Post> findByMemberIdAndCategoryAndPublishedTrue(Long memberId, String category, Pageable pageable);

    // 특정 게시글 (작성자 포함 fetch)
    @Query("SELECT p FROM Post p JOIN FETCH p.member WHERE p.id = :id")
    Optional<Post> findByIdWithMember(@Param("id") Long id);

    // 임시저장 목록
    List<Post> findByMemberIdAndPublishedFalse(Long memberId);

    // 태그 검색
    @Query("SELECT p FROM Post p WHERE p.visibility = 'PUBLIC' AND p.published = true AND p.tags LIKE %:tag%")
    Page<Post> findByTag(@Param("tag") String tag, Pageable pageable);

    // 제목/내용 검색
    @Query("SELECT p FROM Post p WHERE p.visibility = 'PUBLIC' AND p.published = true " +
           "AND (p.title LIKE %:keyword% OR p.content LIKE %:keyword%)")
    Page<Post> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 블로그 포스트 수
    long countByMemberIdAndPublishedTrue(Long memberId);
}
