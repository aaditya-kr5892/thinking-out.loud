package com.blog.ThinkingOutLoud.controller;

import com.blog.ThinkingOutLoud.dto.CommentResponse;
import com.blog.ThinkingOutLoud.dto.CreateCommentRequest;
import com.blog.ThinkingOutLoud.dto.UpdateCommentRequest;
import com.blog.ThinkingOutLoud.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs/{blogId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentResponse addComment(@PathVariable Long blogId,
                                      @Valid @RequestBody CreateCommentRequest request) {
        return commentService.addComment(blogId, request);
    }

    @GetMapping
    public List<CommentResponse> getComments(@PathVariable Long blogId) {
        return commentService.getCommentsByBlog(blogId);
    }

    @PatchMapping("/{commentId}")
    public CommentResponse editComment(@PathVariable Long blogId,
                                       @PathVariable Long commentId,
                                       @RequestBody UpdateCommentRequest request) {
        return commentService.editComment(blogId, commentId, request);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}