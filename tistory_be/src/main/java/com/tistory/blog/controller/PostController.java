package com.tistory.blog.controller;

import com.tistory.blog.dto.request.PostCreateRequest;
import com.tistory.blog.dto.request.PostUpdateRequest;
import com.tistory.blog.dto.response.ApiResponse;
import com.tistory.blog.dto.response.PostResponse;
import com.tistory.blog.dto.response.PostSummaryResponse;
import com.tistory.blog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 게시글 API
 *
 * POST   /api/posts                글 작성        [인증 필요]
 * PUT    /api/posts/{id}           글 수정        [인증 필요]
 * DELETE /api/posts/{id}           글 삭제        [인증 필요]
 * PATCH  /api/posts/{id}/publish   발행 상태 변경  [인증 필요]
 * GET    /api/posts/{id}           글 단건 조회    [공개]
 * GET    /api/posts                전체 글 목록    [공개]
 * GET    /api/posts/search         키워드 검색     [공개]
 * GET    /api/posts/tag/{tag}      태그 검색       [공개]
 * GET    /api/posts/drafts         임시저장 목록   [인증 필요]
 */
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /* ── 글 작성 ── */
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> create(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody PostCreateRequest req) {
        PostResponse post = postService.create(memberId, req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("글이 작성되었습니다.", post));
    }

    /* ── 글 수정 ── */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> update(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(postService.update(memberId, id, req)));
    }

    /* ── 글 삭제 ── */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long id) {
        postService.delete(memberId, id);
        return ResponseEntity.ok(ApiResponse.ok("삭제되었습니다.", null));
    }

    /* ── 발행 / 임시저장 전환 ── */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<PostResponse>> togglePublish(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean publish = Boolean.TRUE.equals(body.get("published"));
        return ResponseEntity.ok(ApiResponse.ok(postService.togglePublish(memberId, id, publish)));
    }

    /* ── 글 단건 조회 ── */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getPost(id)));
    }

    /* ── 전체 공개 글 목록 ── */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostSummaryResponse>>> getPosts(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getPublicPosts(page, size)));
    }

    /* ── 키워드 검색 ── */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<PostSummaryResponse>>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(postService.search(keyword, page, size)));
    }

    /* ── 태그 검색 ── */
    @GetMapping("/tag/{tag}")
    public ResponseEntity<ApiResponse<Page<PostSummaryResponse>>> searchByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(postService.searchByTag(tag, page, size)));
    }

    /* ── 임시저장 목록 ── */
    @GetMapping("/drafts")
    public ResponseEntity<ApiResponse<List<PostSummaryResponse>>> getDrafts(
            @AuthenticationPrincipal Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getDrafts(memberId)));
    }
}
