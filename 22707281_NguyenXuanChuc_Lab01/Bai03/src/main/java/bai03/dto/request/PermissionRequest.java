package bai03.dto.request;

import lombok.Data;

@Data
public class PermissionRequest {
    private String name;
    private String resource;
}
