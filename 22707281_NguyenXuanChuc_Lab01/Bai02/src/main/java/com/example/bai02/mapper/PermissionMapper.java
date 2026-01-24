package com.example.bai02.mapper;

import com.example.bai02.dto.request.PermissionRequest;
import com.example.bai02.dto.response.PermissionResponse;
import com.example.bai02.entity.Permission;
import org.springframework.stereotype.Component;

@Component
public class PermissionMapper {

    public Permission toPermission(PermissionRequest request) {
        Permission permission = new Permission();
        permission.setName(request.getName());
        permission.setResource(request.getResource());
        return permission;
    }

    public PermissionResponse toPermissionResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .resource(permission.getResource())
                .build();
    }
}
