package com.tistory.blog.dto.request;

import com.tistory.blog.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class PostUpdateRequest {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @Size(max = 50)
    private String category;

    private Post.Visibility visibility;

    private String thumbnailUrl;

    private List<String> tags;

    public String getTagsAsString() {
        if (tags == null || tags.isEmpty()) return "";
        return String.join(",", tags);
    }
}
