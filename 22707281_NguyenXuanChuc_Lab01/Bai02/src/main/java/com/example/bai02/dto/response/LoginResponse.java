package com.example.bai02.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String username;
    private String role;

    public LoginResponse(String accessToken, String username, String role) {
        this.accessToken = accessToken;
        this.username = username;
        this.role = role;
    }
}
