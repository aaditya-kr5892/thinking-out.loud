package com.blog.ThinkingOutLoud.service;

import com.blog.ThinkingOutLoud.dto.*;
import com.blog.ThinkingOutLoud.entity.Blog;
import com.blog.ThinkingOutLoud.entity.Comment;
import com.blog.ThinkingOutLoud.entity.User;
import com.blog.ThinkingOutLoud.exception.ResourceNotFoundException;
import com.blog.ThinkingOutLoud.repository.BlogRepository;
import com.blog.ThinkingOutLoud.repository.CommentRepository;
import com.blog.ThinkingOutLoud.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    public CommentService(CommentRepository commentRepository,
                          BlogRepository blogRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse editComment(Long blogId,
                                  Long commentId,
                                  UpdateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Comment not found with id " + commentId));

        String currentUsername = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (!comment.getAuthor().getUsername().equals(currentUsername)) {
            throw new RuntimeException(
                    "You can edit only your own comment");
        }

        if (!comment.getBlog().getId().equals(blogId)) {
            throw new ResourceNotFoundException(
                    "Comment does not belong to blog " + blogId);
        }

        if (request.getContent() != null) {
            comment.setContent(request.getContent());
        }

        Comment updated = commentRepository.save(comment);

        return mapToResponse(updated);
    }

    public CommentResponse addComment(Long blogId, CreateCommentRequest request) {

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blog not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setBlog(blog);


        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        comment.setAuthor(user);
        if (request.getParentId() != null) {

            Comment parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Parent comment not found"));

            // ensure same blog
            if (!parent.getBlog().getId().equals(blogId)) {
                throw new ResourceNotFoundException("Invalid parent comment");
            }

            // enforce single-level rule
            if (parent.getParent() != null) {
                throw new IllegalArgumentException("Replies cannot have replies");
            }

            comment.setParent(parent);
        }

        Comment saved = commentRepository.save(comment);

        return mapToResponse(saved);
    }

    public List<CommentResponse> getCommentsByBlog(Long blogId) {

        if (!blogRepository.existsById(blogId)) {
            throw new ResourceNotFoundException("Blog not found");
        }

        List<Comment> topLevel = commentRepository
                .findByBlogIdAndParentIsNull(blogId);

        return topLevel.stream()
                .map(this::mapWithReplies)
                .toList();
    }

    public void deleteComment(Long commentId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Comment not found with id " + commentId));

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(auth ->
                        auth.getAuthority().equals("ROLE_ADMIN"));

        String currentUsername = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();


        if (comment.getAuthor().getUsername().equals(currentUsername) || isAdmin) {
            commentRepository.delete(comment);
        }
        else{
            throw new RuntimeException(
                    "You can delete only your own comment");
        }
    }

    private CommentResponse mapToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }

    private CommentResponse mapWithReplies(Comment comment) {

        CommentResponse response = mapToResponse(comment);

        List<Comment> replies = commentRepository.findByParentId(comment.getId());

        List<CommentResponse> replyResponses = replies.stream()
                .map(this::mapToResponse)
                .toList();

        response.setReplies(replyResponses);

        return response;
    }
}
