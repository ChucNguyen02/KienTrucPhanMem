package bai03.mapper;

import bai03.dto.response.RoleResponse;
import bai03.entity.Role;
import bai03.dto.request.RoleRequest;
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
