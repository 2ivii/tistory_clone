package com.tistory.blog.dto.response;

import com.tistory.blog.entity.Member;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MemberResponse {
    private Long          id;
    private String        email;
    private String        nickname;
    private String        blogAddress;
    private String        blogTitle;
    private String        blogDescription;
    private String        profileEmoji;
    private String        theme;
    private String        role;
    private LocalDateTime createdAt;

    public static MemberResponse from(Member m) {
        return MemberResponse.builder()
                .id(m.getId())
                .email(m.getEmail())
                .nickname(m.getNickname())
                .blogAddress(m.getBlogAddress())
                .blogTitle(m.getBlogTitle())
                .blogDescription(m.getBlogDescription())
                .profileEmoji(m.getProfileEmoji())
                .theme(m.getTheme())
                .role(m.getRole().name())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
