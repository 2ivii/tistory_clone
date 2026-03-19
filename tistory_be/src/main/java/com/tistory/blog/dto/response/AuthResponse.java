package com.tistory.blog.dto.response;

import com.tistory.blog.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {
    private String         accessToken;
    private String         refreshToken;
    private String         tokenType;
    private MemberResponse member;

    public static AuthResponse of(String access, String refresh, Member member) {
        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .tokenType("Bearer")
                .member(MemberResponse.from(member))
                .build();
    }
}
