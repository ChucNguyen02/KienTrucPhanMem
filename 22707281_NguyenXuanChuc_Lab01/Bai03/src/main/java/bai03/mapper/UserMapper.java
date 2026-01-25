package bai03.mapper;

import bai03.dto.response.UserResponse;
import bai03.entity.User;
import bai03.dto.request.UserCreationRequest;
import bai03.dto.request.UserUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toUser(UserCreationRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        return user;
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
    }

    public void updateUser(User user, UserUpdateRequest request) {
        if (request.getPassword() != null) {
            user.setPassword(request.getPassword());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
    }
}
