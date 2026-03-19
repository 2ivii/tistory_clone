package com.tistory.blog.dto.request;

import com.tistory.blog.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/** 글 작성 요청 */
@Getter
@NoArgsConstructor
public class PostCreateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200, message = "제목은 200자 이하이어야 합니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @Size(max = 50, message = "카테고리는 50자 이하이어야 합니다.")
    private String category;

    private Post.Visibility visibility = Post.Visibility.PUBLIC;

    private boolean published = true;   // false = 임시저장

    private String thumbnailUrl;

    private List<String> tags;          // ["React", "프론트엔드"]

    /** 태그 리스트 → 쉼표 구분 문자열 */
    public String getTagsAsString() {
        if (tags == null || tags.isEmpty()) return "";
        return String.join(",", tags);
    }
}
