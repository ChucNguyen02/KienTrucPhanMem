package iuh.fit.backend.plugins.registration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRegistrationRequest(
        @NotNull Long campaignId,
        @NotBlank @Size(max = 30) String studentCode,
        @NotBlank @Size(max = 120) String studentName
) {
}

