package com.tistory.blog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = "password")
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 20)
    private String nickname;

    @Column(length = 20)
    private String phone;

    @Column(length = 10)
    private String gender;

    @Column(length = 10)
    private String birthDate;   // "YYYY-MM-DD"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    // 블로그 설정
    @Column(unique = true, length = 50)
    private String blogAddress;

    @Column(length = 100)
    private String blogTitle;

    @Column(length = 200)
    private String blogDescription;

    @Column(length = 10)
    private String profileEmoji = "👩‍💻";

    @Column(length = 20)
    private String theme = "light";

    // 약관 동의
    private boolean agreedService   = false;
    private boolean agreedPrivacy   = false;
    private boolean agreedLocation  = false;
    private boolean agreedMarketing = false;

    @Builder
    public Member(String email, String password, String nickname, String phone,
                  String gender, String birthDate, String blogAddress,
                  String blogTitle, String blogDescription,
                  String profileEmoji, String theme,
                  boolean agreedService, boolean agreedPrivacy,
                  boolean agreedLocation, boolean agreedMarketing) {
        this.email           = email;
        this.password        = password;
        this.nickname        = nickname;
        this.phone           = phone;
        this.gender          = gender;
        this.birthDate       = birthDate;
        this.blogAddress     = blogAddress;
        this.blogTitle       = blogTitle;
        this.blogDescription = blogDescription;
        this.profileEmoji    = profileEmoji != null ? profileEmoji : "👩‍💻";
        this.theme           = theme != null ? theme : "light";
        this.agreedService   = agreedService;
        this.agreedPrivacy   = agreedPrivacy;
        this.agreedLocation  = agreedLocation;
        this.agreedMarketing = agreedMarketing;
    }

    public void updateBlogInfo(String blogTitle, String blogDescription,
                               String profileEmoji, String theme) {
        this.blogTitle       = blogTitle;
        this.blogDescription = blogDescription;
        this.profileEmoji    = profileEmoji;
        this.theme           = theme;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public enum Role {
        USER, ADMIN
    }
}
