package com.blog.ThinkingOutLoud.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBlogRequest {
    String title;
    String content;
    String imageUrl;
}
