package com.blog.ThinkingOutLoud.repository;

import com.blog.ThinkingOutLoud.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Long> {
}
