package com.example.bai02.service;

import com.example.bai02.dto.request.PermissionRequest;
import com.example.bai02.dto.response.PermissionResponse;
import com.example.bai02.entity.Permission;
import com.example.bai02.mapper.PermissionMapper;
import com.example.bai02.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .collect(Collectors.toList());
    }

    public void deletePermission(Long permissionId) {
        permissionRepository.deleteById(permissionId);
    }
}
