package com.example.bai02.repository;

import com.example.bai02.entity.Role;
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
    private Long nextId = 3L;

    public UserRepository() {
        // Tạo sẵn 2 user
        Role adminRole = new Role(1L, "ADMIN");
        Role guestRole = new Role(2L, "GUEST");

        users.add(new User(1L, "admin", encoder.encode("admin123"), "admin@example.com", adminRole));
        users.add(new User(2L, "guest", encoder.encode("guest123"), "guest@example.com", guestRole));
    }

    public Optional<User> findByUsername(String username) {
        return users.stream()
                .filter(u -> u.getUsername().equals(username))
                .findFirst();
    }

    public Optional<User> findById(Long id) {
        return users.stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }

    public List<User> findAll() {
        return new ArrayList<>(users);
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(nextId++);
            user.setPassword(encoder.encode(user.getPassword()));
            users.add(user);
        } else {
            users.removeIf(u -> u.getId().equals(user.getId()));
            users.add(user);
        }
        return user;
    }

    public void deleteById(Long id) {
        users.removeIf(u -> u.getId().equals(id));
    }

    public boolean existsByUsername(String username) {
        return users.stream().anyMatch(u -> u.getUsername().equals(username));
    }
}
