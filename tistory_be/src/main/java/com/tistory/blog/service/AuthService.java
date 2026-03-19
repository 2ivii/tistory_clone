package com.tistory.blog.service;

import com.tistory.blog.dto.request.LoginRequest;
import com.tistory.blog.dto.request.SignupRequest;
import com.tistory.blog.dto.response.AuthResponse;
import com.tistory.blog.dto.response.CheckResponse;
import com.tistory.blog.entity.Member;
import com.tistory.blog.entity.RefreshToken;
import com.tistory.blog.exception.DuplicateException;
import com.tistory.blog.exception.ResourceNotFoundException;
import com.tistory.blog.exception.UnauthorizedException;
import com.tistory.blog.repository.MemberRepository;
import com.tistory.blog.repository.RefreshTokenRepository;
import com.tistory.blog.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository      memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder        passwordEncoder;
    private final JwtTokenProvider       jwtTokenProvider;

    /* ── 회원가입 ── */
    @Transactional
    public AuthResponse signup(SignupRequest req) {
        // 중복 검사
        if (memberRepository.existsByEmail(req.getEmail()))
            throw new DuplicateException("이미 사용 중인 이메일입니다.");
        if (memberRepository.existsByNickname(req.getNickname()))
            throw new DuplicateException("이미 사용 중인 닉네임입니다.");
        if (memberRepository.existsByBlogAddress(req.getBlogAddress()))
            throw new DuplicateException("이미 사용 중인 블로그 주소입니다.");

        Member member = Member.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .nickname(req.getNickname())
                .phone(req.getPhone())
                .gender(req.getGender())
                .birthDate(req.getBirthDate())
                .blogAddress(req.getBlogAddress())
                .blogTitle(req.getBlogTitle())
                .blogDescription(req.getBlogDescription())
                .profileEmoji(req.getProfileEmoji())
                .theme(req.getTheme())
                .agreedService(req.isAgreedService())
                .agreedPrivacy(req.isAgreedPrivacy())
                .agreedLocation(req.isAgreedLocation())
                .agreedMarketing(req.isAgreedMarketing())
                .build();

        member = memberRepository.save(member);
        log.info("신규 회원 가입: {}", member.getEmail());

        return issueTokens(member);
    }

    /* ── 로그인 ── */
    @Transactional
    public AuthResponse login(LoginRequest req) {
        Member member = memberRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), member.getPassword()))
            throw new UnauthorizedException("이메일 또는 비밀번호가 올바르지 않습니다.");

        return issueTokens(member);
    }

    /* ── 토큰 재발급 ── */
    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        if (!jwtTokenProvider.validateToken(refreshTokenValue))
            throw new UnauthorizedException("유효하지 않은 Refresh Token입니다.");

        Long memberId = jwtTokenProvider.getMemberId(refreshTokenValue);

        RefreshToken stored = refreshTokenRepository.findByMemberId(memberId)
                .orElseThrow(() -> new UnauthorizedException("Refresh Token을 찾을 수 없습니다."));

        if (!stored.getToken().equals(refreshTokenValue) || stored.isExpired())
            throw new UnauthorizedException("만료된 Refresh Token입니다.");

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("회원을 찾을 수 없습니다."));

        return issueTokens(member);
    }

    /* ── 로그아웃 ── */
    @Transactional
    public void logout(Long memberId) {
        refreshTokenRepository.deleteByMemberId(memberId);
    }

    /* ── 이메일 중복 확인 ── */
    @Transactional(readOnly = true)
    public CheckResponse checkEmail(String email) {
        return memberRepository.existsByEmail(email)
                ? CheckResponse.unavailable("이미 사용 중인 이메일입니다.")
                : CheckResponse.available();
    }

    /* ── 닉네임 중복 확인 ── */
    @Transactional(readOnly = true)
    public CheckResponse checkNickname(String nickname) {
        return memberRepository.existsByNickname(nickname)
                ? CheckResponse.unavailable("이미 사용 중인 닉네임입니다.")
                : CheckResponse.available();
    }

    /* ── 블로그 주소 중복 확인 ── */
    @Transactional(readOnly = true)
    public CheckResponse checkBlogAddress(String blogAddress) {
        return memberRepository.existsByBlogAddress(blogAddress)
                ? CheckResponse.unavailable("이미 사용 중인 블로그 주소입니다.")
                : CheckResponse.available();
    }

    /* ── 토큰 발급 공통 로직 ── */
    private AuthResponse issueTokens(Member member) {
        String accessToken  = jwtTokenProvider.generateAccessToken(
                member.getId(), member.getEmail(), member.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(member.getId());

        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtTokenProvider.getRefreshExpiration() / 1000);

        // RefreshToken upsert
        refreshTokenRepository.findByMemberId(member.getId())
                .ifPresentOrElse(
                        rt -> rt.rotate(refreshToken, expiresAt),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .memberId(member.getId())
                                        .token(refreshToken)
                                        .expiresAt(expiresAt)
                                        .build())
                );

        return AuthResponse.of(accessToken, refreshToken, member);
    }
}
