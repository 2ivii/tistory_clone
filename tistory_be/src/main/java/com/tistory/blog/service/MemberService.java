package com.tistory.blog.service;

import com.tistory.blog.dto.response.MemberResponse;
import com.tistory.blog.entity.Member;
import com.tistory.blog.exception.ResourceNotFoundException;
import com.tistory.blog.repository.MemberRepository;
import com.tistory.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PostRepository   postRepository;

    /* ── 내 정보 조회 ── */
    @Transactional(readOnly = true)
    public MemberResponse getMe(Long memberId) {
        return MemberResponse.from(findMember(memberId));
    }

    /* ── 블로그 프로필 조회 (주소로) ── */
    @Transactional(readOnly = true)
    public Map<String, Object> getBlogProfile(String blogAddress) {
        Member member   = memberRepository.findByBlogAddress(blogAddress)
                .orElseThrow(() -> new ResourceNotFoundException("블로그를 찾을 수 없습니다: " + blogAddress));
        long postCount  = postRepository.countByMemberIdAndPublishedTrue(member.getId());

        return Map.of(
                "nickname",        member.getNickname(),
                "blogTitle",       member.getBlogTitle()       != null ? member.getBlogTitle()       : "",
                "blogDescription", member.getBlogDescription() != null ? member.getBlogDescription() : "",
                "profileEmoji",    member.getProfileEmoji()    != null ? member.getProfileEmoji()    : "👩‍💻",
                "theme",           member.getTheme()           != null ? member.getTheme()           : "light",
                "postCount",       postCount
        );
    }

    /* ── 블로그 설정 수정 ── */
    @Transactional
    public MemberResponse updateBlogInfo(Long memberId, String blogTitle,
                                          String blogDescription, String profileEmoji,
                                          String theme) {
        Member member = findMember(memberId);
        member.updateBlogInfo(blogTitle, blogDescription, profileEmoji, theme);
        return MemberResponse.from(member);
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("회원을 찾을 수 없습니다."));
    }
}
