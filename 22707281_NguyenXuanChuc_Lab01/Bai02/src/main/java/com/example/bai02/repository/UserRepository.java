package com.example.bai02.repository;


import com.example.bai02.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {
    private List<User> users = new ArrayList<>();
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserRepository() {
        // Tạo sẵn 2 user: admin và guest
        users.add(new User(1L, "admin", encoder.encode("admin123"), "ADMIN"));
        users.add(new User(2L, "guest", encoder.encode("guest123"), "GUEST"));
    }

    public Optional<User> findByUsername(String username) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst();
    }

    public User save(User user) {
        user.setId((long) (users.size() + 1));
        user.setPassword(encoder.encode(user.getPassword()));
        users.add(user);
        return user;
    }
}
