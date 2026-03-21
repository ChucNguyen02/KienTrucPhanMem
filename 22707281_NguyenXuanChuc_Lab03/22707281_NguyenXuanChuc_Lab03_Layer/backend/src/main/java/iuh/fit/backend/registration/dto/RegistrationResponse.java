package iuh.fit.backend.registration.dto;

import iuh.fit.backend.registration.entity.RegistrationStatus;

import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        Long eventId,
        String eventTitle,
        String studentCode,
        String fullName,
        String email,
        RegistrationStatus status,
        LocalDateTime registeredAt
) {
}

