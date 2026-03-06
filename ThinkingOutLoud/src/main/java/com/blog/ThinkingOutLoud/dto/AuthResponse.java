package com.blog.ThinkingOutLoud.dto;

import lombok.Getter;

@Getter
public class AuthResponse {

    private final String token;
    private final String username;
    private final String role;
    private final Long id;

    public AuthResponse(String token, String username, String role, Long id) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.id = id;
    }


}