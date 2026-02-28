package com.blog.ThinkingOutLoud.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCommentRequest {

    @NotBlank(message = "Comment content cannot be empty")
    private String content;
    private Long parentId;
}