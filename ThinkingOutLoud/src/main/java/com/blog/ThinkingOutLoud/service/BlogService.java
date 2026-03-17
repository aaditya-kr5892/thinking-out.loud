package com.blog.ThinkingOutLoud.service;

import com.blog.ThinkingOutLoud.dto.BlogResponse;
import com.blog.ThinkingOutLoud.dto.CreateBlogRequest;
import com.blog.ThinkingOutLoud.dto.UpdateBlogRequest;
import com.blog.ThinkingOutLoud.entity.Blog;
import com.blog.ThinkingOutLoud.entity.User;
import com.blog.ThinkingOutLoud.repository.BlogRepository;
import com.blog.ThinkingOutLoud.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final UserRepository userRepository;

    public BlogService(BlogRepository blogRepository, UserRepository userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public BlogResponse create(CreateBlogRequest request) {

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.onCreate();

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        blog.setAuthor(user);

        Blog saved = blogRepository.save(blog);

        return mapToResponse(saved);
    }

    public Page<BlogResponse> getAll(Pageable pageable) {
        return blogRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public BlogResponse getById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        return mapToResponse(blog);
    }

    public BlogResponse update(Long id, UpdateBlogRequest request) {

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        if(request.getTitle() != null){
            blog.setTitle(request.getTitle());
        }

        if(request.getContent() != null){
            blog.setContent(request.getContent());
        }
        blog.onUpdate();

        Blog updated = blogRepository.save(blog);
        return mapToResponse(updated);
    }

    public void delete(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        blogRepository.delete(blog);
    }



    private BlogResponse mapToResponse(Blog blog) {
        BlogResponse response = new BlogResponse();
        response.setId(blog.getId());
        response.setTitle(blog.getTitle());
        response.setContent(blog.getContent());
        response.setImageUrl(blog.getImageUrl());
        response.setCreatedAt(blog.getCreatedAt());
        response.setUpdatedAt(blog.getUpdatedAt());
        return response;
    }
}