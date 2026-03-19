package com.tistory.blog.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long      accessExpiration;
    private final long      refreshExpiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshExpiration) {
        this.key              = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration  = accessExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    /** Access Token 생성 */
    public String generateAccessToken(Long memberId, String email, String role) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + accessExpiration);

        return Jwts.builder()
                .setSubject(String.valueOf(memberId))
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }

    /** Refresh Token 생성 */
    public String generateRefreshToken(Long memberId) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + refreshExpiration);

        return Jwts.builder()
                .setSubject(String.valueOf(memberId))
                .claim("type", "refresh")
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()                     // 1. parserBuilder() -> parser()
                .verifyWith(key)                 // 2. 그대로 유지 (key는 SecretKey 타입이어야 함)
                .build()
                .parseSignedClaims(token)        // 3. parseClaimsJws() -> parseSignedClaims()
                .getPayload();                   // 4. getBody() -> getPayload()
    }
    /** 토큰에서 memberId 추출 */
    public Long getMemberId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    /** 유효성 검증 */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("JWT invalid: {}", e.getMessage());
        }
        return false;
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }
}
