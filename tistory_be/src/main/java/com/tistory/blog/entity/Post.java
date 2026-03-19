package com.tistory.blog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Visibility visibility = Visibility.PUBLIC;

    @Column(nullable = false)
    private int viewCount = 0;

    @Column(nullable = false)
    private int likeCount = 0;

    @Column(nullable = false)
    private boolean published = true;

    @Column(length = 500)
    private String thumbnailUrl;

    // 태그는 쉼표 구분 문자열로 저장 (단순화)
    @Column(length = 300)
    private String tags;

    @Builder
    public Post(Member member, String title, String content, String category,
                Visibility visibility, boolean published,
                String thumbnailUrl, String tags) {
        this.member       = member;
        this.title        = title;
        this.content      = content;
        this.category     = category;
        this.visibility   = visibility != null ? visibility : Visibility.PUBLIC;
        this.published    = published;
        this.thumbnailUrl = thumbnailUrl;
        this.tags         = tags;
    }

    public void update(String title, String content, String category,
                       Visibility visibility, String thumbnailUrl, String tags) {
        this.title        = title;
        this.content      = content;
        this.category     = category;
        this.visibility   = visibility;
        this.thumbnailUrl = thumbnailUrl;
        this.tags         = tags;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void togglePublish(boolean published) {
        this.published = published;
    }

    public List<String> getTagList() {
        if (tags == null || tags.isBlank()) return new ArrayList<>();
        return List.of(tags.split(","));
    }

    public enum Visibility {
        PUBLIC, PRIVATE, PASSWORD
    }
}
