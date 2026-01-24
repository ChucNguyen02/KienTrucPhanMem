package com.example.bai02.repository;

import com.example.bai02.entity.Role;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class RoleRepository {
    private List<Role> roles = new ArrayList<>();
    private Long nextId = 3L;

    public RoleRepository() {
        roles.add(new Role(1L, "ADMIN"));
        roles.add(new Role(2L, "GUEST"));
    }

    public Optional<Role> findByName(String name) {
        return roles.stream()
                .filter(r -> r.getName().equals(name))
                .findFirst();
    }

    public Optional<Role> findById(Long id) {
        return roles.stream()
                .filter(r -> r.getId().equals(id))
                .findFirst();
    }

    public List<Role> findAll() {
        return new ArrayList<>(roles);
    }

    public Role save(Role role) {
        if (role.getId() == null) {
            role.setId(nextId++);
            roles.add(role);
        } else {
            roles.removeIf(r -> r.getId().equals(role.getId()));
            roles.add(role);
        }
        return role;
    }

    public void deleteById(Long id) {
        roles.removeIf(r -> r.getId().equals(id));
    }
}
