package com.tistory.blog.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CheckResponse {
    private boolean available;
    private String  message;

    public static CheckResponse available() {
        return CheckResponse.builder().available(true).message("사용 가능합니다.").build();
    }

    public static CheckResponse unavailable(String reason) {
        return CheckResponse.builder().available(false).message(reason).build();
    }
}
