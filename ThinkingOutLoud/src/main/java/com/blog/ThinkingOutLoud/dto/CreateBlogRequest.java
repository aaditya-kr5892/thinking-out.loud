package com.blog.ThinkingOutLoud.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class CreateBlogRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Content cannot be empty")
    private String content;

    @NotBlank(message = "Header image cannot be empty")
    private String imageUrl;
}