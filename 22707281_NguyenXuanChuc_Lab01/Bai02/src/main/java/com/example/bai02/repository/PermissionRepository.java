package com.example.bai02.repository;

import com.example.bai02.entity.Permission;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class PermissionRepository {
    private List<Permission> permissions = new ArrayList<>();
    private Long nextId = 4L;

    public PermissionRepository() {
        permissions.add(new Permission(1L, "READ", "USER"));
        permissions.add(new Permission(2L, "WRITE", "USER"));
        permissions.add(new Permission(3L, "DELETE", "USER"));
    }

    public Optional<Permission> findById(Long id) {
        return permissions.stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    public List<Permission> findAll() {
        return new ArrayList<>(permissions);
    }

    public Permission save(Permission permission) {
        if (permission.getId() == null) {
            permission.setId(nextId++);
            permissions.add(permission);
        } else {
            permissions.removeIf(p -> p.getId().equals(permission.getId()));
            permissions.add(permission);
        }
        return permission;
    }

    public void deleteById(Long id) {
        permissions.removeIf(p -> p.getId().equals(id));
    }
}
