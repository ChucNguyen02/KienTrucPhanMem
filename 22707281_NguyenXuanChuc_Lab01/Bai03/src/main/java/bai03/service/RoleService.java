package bai03.service;

import bai03.dto.request.RoleRequest;
import bai03.dto.response.RoleResponse;
import bai03.entity.Role;
import bai03.mapper.RoleMapper;
import bai03.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleResponse createRole(RoleRequest request) {
        Role role = roleMapper.toRole(request);
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .collect(Collectors.toList());
    }

    public void deleteRole(Long roleId) {
        roleRepository.deleteById(roleId);
    }
}
