package bai03.dto.request;

import lombok.Data;

@Data
public class UserCreationRequest {
    private String username;
    private String password;
    private String email;
    private String role;
}