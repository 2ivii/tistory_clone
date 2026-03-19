package com.tistory.blog.controller;

import com.tistory.blog.dto.response.ApiResponse;
import com.tistory.blog.dto.response.MemberResponse;
import com.tistory.blog.dto.response.PostSummaryResponse;
import com.tistory.blog.service.MemberService;
import com.tistory.blog.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 블로그 API
 *
 * GET    /api/blogs/{blogAddress}           블로그 프로필 조회
 * GET    /api/blogs/{blogAddress}/posts     블로그 글 목록
 * GET    /api/members/me                    내 정보 조회   [인증 필요]
 * PATCH  /api/members/me/blog              블로그 설정 수정 [인증 필요]
 */
@RestController
@RequiredArgsConstructor
public class BlogController {

    private final MemberService memberService;
    private final PostService   postService;

    /* ── 블로그 프로필 조회 ── */
    @GetMapping("/api/blogs/{blogAddress}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBlogProfile(
            @PathVariable String blogAddress) {
        return ResponseEntity.ok(ApiResponse.ok(memberService.getBlogProfile(blogAddress)));
    }

    /* ── 블로그 글 목록 ── */
    @GetMapping("/api/blogs/{blogAddress}/posts")
    public ResponseEntity<ApiResponse<Page<PostSummaryResponse>>> getBlogPosts(
            @PathVariable String blogAddress,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(
                ApiResponse.ok(postService.getBlogPosts(blogAddress, category, page, size)));
    }

    /* ── 내 정보 조회 ── */
    @GetMapping("/api/members/me")
    public ResponseEntity<ApiResponse<MemberResponse>> getMe(
            @AuthenticationPrincipal Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(memberService.getMe(memberId)));
    }

    /* ── 블로그 설정 수정 ── */
    @PatchMapping("/api/members/me/blog")
    public ResponseEntity<ApiResponse<MemberResponse>> updateBlogInfo(
            @AuthenticationPrincipal Long memberId,
            @RequestBody Map<String, String> body) {
        MemberResponse updated = memberService.updateBlogInfo(
                memberId,
                body.get("blogTitle"),
                body.get("blogDescription"),
                body.get("profileEmoji"),
                body.get("theme")
        );
        return ResponseEntity.ok(ApiResponse.ok("블로그 설정이 수정되었습니다.", updated));
    }
}
