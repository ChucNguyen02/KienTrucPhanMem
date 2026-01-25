package bai03.mapper;

import bai03.dto.response.PermissionResponse;
import bai03.dto.request.PermissionRequest;
import bai03.entity.Permission;
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
