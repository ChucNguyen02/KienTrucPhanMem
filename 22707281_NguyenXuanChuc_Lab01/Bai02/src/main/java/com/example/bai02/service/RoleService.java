package com.example.bai02.service;

import com.example.bai02.dto.request.RoleRequest;
import com.example.bai02.dto.response.RoleResponse;
import com.example.bai02.entity.Role;
import com.example.bai02.mapper.RoleMapper;
import com.example.bai02.repository.RoleRepository;
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
