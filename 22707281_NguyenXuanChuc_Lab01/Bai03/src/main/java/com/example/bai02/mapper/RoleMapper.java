package com.example.bai02.mapper;

import com.example.bai02.dto.request.RoleRequest;
import com.example.bai02.dto.response.RoleResponse;
import com.example.bai02.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public Role toRole(RoleRequest request) {
        Role role = new Role();
        role.setName(request.getName());
        return role;
    }

    public RoleResponse toRoleResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .build();
    }
}
