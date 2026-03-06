package com.blog.ThinkingOutLoud.controller;

import com.blog.ThinkingOutLoud.dto.AuthResponse;
import com.blog.ThinkingOutLoud.dto.LoginRequest;
import com.blog.ThinkingOutLoud.dto.RegisterRequest;
import com.blog.ThinkingOutLoud.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}