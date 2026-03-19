package com.tistory.blog.dto.response;

import com.tistory.blog.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PostSummaryResponse {
    private Long          id;
    private String        title;
    private String        excerpt;       // 본문 앞 150자, HTML 태그 제거
    private String        category;
    private String        visibility;
    private int           viewCount;
    private int           likeCount;
    private String        thumbnailUrl;
    private List<String>  tags;
    private String        authorNickname;
    private String        authorEmoji;
    private String        blogAddress;
    private LocalDateTime createdAt;

    public static PostSummaryResponse from(Post p) {
        // HTML 태그 제거 후 150자 발췌
        String raw     = p.getContent().replaceAll("<[^>]*>", "").replaceAll("\\s+", " ").trim();
        String excerpt = raw.length() > 150 ? raw.substring(0, 150) + "..." : raw;

        return PostSummaryResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .excerpt(excerpt)
                .category(p.getCategory())
                .visibility(p.getVisibility().name())
                .viewCount(p.getViewCount())
                .likeCount(p.getLikeCount())
                .thumbnailUrl(p.getThumbnailUrl())
                .tags(p.getTagList())
                .authorNickname(p.getMember().getNickname())
                .authorEmoji(p.getMember().getProfileEmoji())
                .blogAddress(p.getMember().getBlogAddress())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
