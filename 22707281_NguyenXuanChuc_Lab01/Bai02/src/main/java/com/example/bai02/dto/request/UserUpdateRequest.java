package com.example.bai02.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String password;
    private String email;
    private String role;
}
