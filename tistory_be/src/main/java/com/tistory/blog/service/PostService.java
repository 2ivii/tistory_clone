package com.tistory.blog.service;

import com.tistory.blog.dto.request.PostCreateRequest;
import com.tistory.blog.dto.request.PostUpdateRequest;
import com.tistory.blog.dto.response.PostResponse;
import com.tistory.blog.dto.response.PostSummaryResponse;
import com.tistory.blog.entity.Member;
import com.tistory.blog.entity.Post;
import com.tistory.blog.exception.ForbiddenException;
import com.tistory.blog.exception.ResourceNotFoundException;
import com.tistory.blog.repository.MemberRepository;
import com.tistory.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository   postRepository;
    private final MemberRepository memberRepository;

    /* ── 글 작성 ── */
    @Transactional
    public PostResponse create(Long memberId, PostCreateRequest req) {
        Member member = findMember(memberId);

        Post post = Post.builder()
                .member(member)
                .title(req.getTitle())
                .content(req.getContent())
                .category(req.getCategory())
                .visibility(req.getVisibility())
                .published(req.isPublished())
                .thumbnailUrl(req.getThumbnailUrl())
                .tags(req.getTagsAsString())
                .build();

        post = postRepository.save(post);
        log.info("글 작성 완료 - postId:{}, memberId:{}", post.getId(), memberId);
        return PostResponse.from(post);
    }

    /* ── 글 수정 ── */
    @Transactional
    public PostResponse update(Long memberId, Long postId, PostUpdateRequest req) {
        Post post = findPostWithMember(postId);
        checkOwnership(post, memberId);

        post.update(
                req.getTitle(),
                req.getContent(),
                req.getCategory(),
                req.getVisibility(),
                req.getThumbnailUrl(),
                req.getTagsAsString()
        );
        return PostResponse.from(post);
    }

    /* ── 글 삭제 ── */
    @Transactional
    public void delete(Long memberId, Long postId) {
        Post post = findPostWithMember(postId);
        checkOwnership(post, memberId);
        postRepository.delete(post);
        log.info("글 삭제 - postId:{}, memberId:{}", postId, memberId);
    }

    /* ── 글 발행 / 임시저장 전환 ── */
    @Transactional
    public PostResponse togglePublish(Long memberId, Long postId, boolean publish) {
        Post post = findPostWithMember(postId);
        checkOwnership(post, memberId);
        post.togglePublish(publish);
        return PostResponse.from(post);
    }

    /* ── 글 단건 조회 (조회수 증가) ── */
    @Transactional
    public PostResponse getPost(Long postId) {
        Post post = findPostWithMember(postId);
        post.increaseViewCount();
        return PostResponse.from(post);
    }

    /* ── 전체 공개 글 목록 (페이징) ── */
    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getPublicPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository
                .findByVisibilityAndPublishedTrue(Post.Visibility.PUBLIC, pageable)
                .map(PostSummaryResponse::from);
    }

    /* ── 특정 블로그 글 목록 ── */
    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> getBlogPosts(String blogAddress, String category,
                                                   int page, int size) {
        Member member = memberRepository.findByBlogAddress(blogAddress)
                .orElseThrow(() -> new ResourceNotFoundException("블로그를 찾을 수 없습니다: " + blogAddress));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Post> posts = (category != null && !category.isBlank())
                ? postRepository.findByMemberIdAndCategoryAndPublishedTrue(member.getId(), category, pageable)
                : postRepository.findByMemberIdAndPublishedTrue(member.getId(), pageable);

        return posts.map(PostSummaryResponse::from);
    }

    /* ── 내 임시저장 목록 ── */
    @Transactional(readOnly = true)
    public List<PostSummaryResponse> getDrafts(Long memberId) {
        return postRepository.findByMemberIdAndPublishedFalse(memberId)
                .stream()
                .map(PostSummaryResponse::from)
                .toList();
    }

    /* ── 키워드 검색 ── */
    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.searchByKeyword(keyword, pageable).map(PostSummaryResponse::from);
    }

    /* ── 태그 검색 ── */
    @Transactional(readOnly = true)
    public Page<PostSummaryResponse> searchByTag(String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByTag(tag, pageable).map(PostSummaryResponse::from);
    }

    /* ── 내부 헬퍼 ── */
    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("회원을 찾을 수 없습니다."));
    }

    private Post findPostWithMember(Long postId) {
        return postRepository.findByIdWithMember(postId)
                .orElseThrow(() -> new ResourceNotFoundException("글을 찾을 수 없습니다: " + postId));
    }

    private void checkOwnership(Post post, Long memberId) {
        if (!post.getMember().getId().equals(memberId))
            throw new ForbiddenException("해당 글에 대한 권한이 없습니다.");
    }
}
