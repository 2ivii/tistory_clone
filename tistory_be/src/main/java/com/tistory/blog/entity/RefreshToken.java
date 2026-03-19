package com.tistory.blog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long memberId;

    @Column(nullable = false, length = 512)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Builder
    public RefreshToken(Long memberId, String token, LocalDateTime expiresAt) {
        this.memberId  = memberId;
        this.token     = token;
        this.expiresAt = expiresAt;
    }

    public void rotate(String newToken, LocalDateTime newExpiry) {
        this.token     = newToken;
        this.expiresAt = newExpiry;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
