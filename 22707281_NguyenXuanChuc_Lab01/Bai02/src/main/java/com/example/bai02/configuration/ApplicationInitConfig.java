package com.example.bai02.configuration;

import com.example.bai02.entity.Permission;
import com.example.bai02.entity.Role;
import com.example.bai02.entity.User;
import com.example.bai02.repository.PermissionRepository;
import com.example.bai02.repository.RoleRepository;
import com.example.bai02.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PermissionRepository permissionRepository) {

        return args -> {
            // Tạo Permissions
            if (permissionRepository.count() == 0) {
                Permission readPerm = permissionRepository.save(new Permission("READ", "USER"));
                Permission writePerm = permissionRepository.save(new Permission("WRITE", "USER"));
                Permission deletePerm = permissionRepository.save(new Permission("DELETE", "USER"));
                log.info("Permissions created");
            }

            // Tạo Roles
            if (roleRepository.count() == 0) {
                Set<Permission> adminPerms = new HashSet<>(permissionRepository.findAll());

                Role adminRole = new Role();
                adminRole.setName("ADMIN");
                adminRole.setPermissions(adminPerms);
                roleRepository.save(adminRole);

                Role guestRole = new Role();
                guestRole.setName("GUEST");
                guestRole.setPermissions(new HashSet<>());
                roleRepository.save(guestRole);

                log.info("Roles created");
            }

            // Tạo Users
            if (userRepository.count() == 0) {
                Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
                Role guestRole = roleRepository.findByName("GUEST").orElseThrow();

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@example.com");
                admin.setRole(adminRole);
                userRepository.save(admin);

                User guest = new User();
                guest.setUsername("guest");
                guest.setPassword(passwordEncoder.encode("guest123"));
                guest.setEmail("guest@example.com");
                guest.setRole(guestRole);
                userRepository.save(guest);

                log.info("Default users created: admin/admin123, guest/guest123");
            }
        };
    }
}