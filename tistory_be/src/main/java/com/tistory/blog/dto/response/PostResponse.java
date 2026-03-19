package com.tistory.blog.dto.response;

import com.tistory.blog.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PostResponse {
    private Long          id;
    private String        title;
    private String        content;
    private String        category;
    private String        visibility;
    private int           viewCount;
    private int           likeCount;
    private boolean       published;
    private String        thumbnailUrl;
    private List<String>  tags;
    private String        authorNickname;
    private String        authorEmoji;
    private String        blogAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post p) {
        return PostResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .content(p.getContent())
                .category(p.getCategory())
                .visibility(p.getVisibility().name())
                .viewCount(p.getViewCount())
                .likeCount(p.getLikeCount())
                .published(p.isPublished())
                .thumbnailUrl(p.getThumbnailUrl())
                .tags(p.getTagList())
                .authorNickname(p.getMember().getNickname())
                .authorEmoji(p.getMember().getProfileEmoji())
                .blogAddress(p.getMember().getBlogAddress())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
