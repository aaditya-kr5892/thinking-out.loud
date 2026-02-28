package com.blog.ThinkingOutLoud.controller;

import com.blog.ThinkingOutLoud.dto.BlogResponse;
import com.blog.ThinkingOutLoud.dto.CreateBlogRequest;
import com.blog.ThinkingOutLoud.dto.UpdateBlogRequest;
import com.blog.ThinkingOutLoud.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping
    public ResponseEntity<BlogResponse> create(@Valid @RequestBody CreateBlogRequest request) {
        BlogResponse response = blogService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public Page<BlogResponse> getAll(Pageable pageable) {
        return blogService.getAll(pageable);
    }
    @GetMapping("/{id}")
    public ResponseEntity<BlogResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getById(id));
    }

    @PatchMapping("/{id}")
    public BlogResponse update(@PathVariable Long id,
                               @RequestBody UpdateBlogRequest request) {
        return blogService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}