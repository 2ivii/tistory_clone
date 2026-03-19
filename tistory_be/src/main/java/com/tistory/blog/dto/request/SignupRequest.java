package com.tistory.blog.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

/** 회원가입 요청 DTO */
@Getter
@NoArgsConstructor
public class SignupRequest {

    // ── Step1: 기본 정보 ──
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    @Pattern(
        regexp = "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$",
        message = "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다."
    )
    private String password;

    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(min = 2, max = 12, message = "닉네임은 2~12자이어야 합니다.")
    private String nickname;

    @Pattern(regexp = "^010-\\d{4}-\\d{4}$", message = "올바른 휴대폰 번호 형식이 아닙니다.")
    private String phone;

    private String gender;      // 남성 | 여성 | 선택 안함
    private String birthDate;   // YYYY-MM-DD

    // ── Step2: 블로그 설정 ──
    @NotBlank(message = "블로그 이름은 필수입니다.")
    @Size(min = 2, max = 30, message = "블로그 이름은 2~30자이어야 합니다.")
    private String blogTitle;

    @NotBlank(message = "블로그 주소는 필수입니다.")
    @Size(min = 3, max = 20, message = "블로그 주소는 3~20자이어야 합니다.")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "블로그 주소는 영문 소문자, 숫자, 하이픈만 사용 가능합니다.")
    private String blogAddress;

    @Size(max = 150, message = "블로그 소개는 150자 이하이어야 합니다.")
    private String blogDescription;

    private String profileEmoji;
    private String theme;   // light | dark | warm

    // ── 약관 동의 ──
    @AssertTrue(message = "서비스 이용약관에 동의해야 합니다.")
    private boolean agreedService;

    @AssertTrue(message = "개인정보 처리방침에 동의해야 합니다.")
    private boolean agreedPrivacy;

    private boolean agreedLocation;
    private boolean agreedMarketing;
}
