package com.tistory.blog.controller;

import com.tistory.blog.dto.request.LoginRequest;
import com.tistory.blog.dto.request.SignupRequest;
import com.tistory.blog.dto.response.ApiResponse;
import com.tistory.blog.dto.response.AuthResponse;
import com.tistory.blog.dto.response.CheckResponse;
import com.tistory.blog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 인증 API
 *
 * POST   /api/auth/signup              회원가입
 * POST   /api/auth/login               로그인
 * POST   /api/auth/refresh             토큰 재발급
 * POST   /api/auth/logout              로그아웃  [인증 필요]
 * GET    /api/auth/check/email         이메일 중복 확인
 * GET    /api/auth/check/nickname      닉네임 중복 확인
 * GET    /api/auth/check/blog-address  블로그 주소 중복 확인
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /* ── 회원가입 ── */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest req) {
        AuthResponse response = authService.signup(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("회원가입이 완료되었습니다.", response));
    }

    /* ── 로그인 ── */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(authService.login(req)));
    }

    /* ── 토큰 재발급 ── */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        return ResponseEntity.ok(ApiResponse.ok(authService.refresh(refreshToken)));
    }

    /* ── 로그아웃 ── */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal Long memberId) {
        authService.logout(memberId);
        return ResponseEntity.ok(ApiResponse.ok("로그아웃 되었습니다.", null));
    }

    /* ── 이메일 중복 확인 ── */
    @GetMapping("/check/email")
    public ResponseEntity<ApiResponse<CheckResponse>> checkEmail(
            @RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.ok(authService.checkEmail(email)));
    }

    /* ── 닉네임 중복 확인 ── */
    @GetMapping("/check/nickname")
    public ResponseEntity<ApiResponse<CheckResponse>> checkNickname(
            @RequestParam String nickname) {
        return ResponseEntity.ok(ApiResponse.ok(authService.checkNickname(nickname)));
    }

    /* ── 블로그 주소 중복 확인 ── */
    @GetMapping("/check/blog-address")
    public ResponseEntity<ApiResponse<CheckResponse>> checkBlogAddress(
            @RequestParam String blogAddress) {
        return ResponseEntity.ok(ApiResponse.ok(authService.checkBlogAddress(blogAddress)));
    }
}
