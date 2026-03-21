package iuh.fit.backend.plugins.registration.dto;

import iuh.fit.backend.plugins.registration.entity.Registration;

import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        Long campaignId,
        String studentCode,
        String studentName,
        LocalDateTime registeredAt,
        String attendanceStatus
) {
    public static RegistrationResponse from(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getCampaign().getId(),
                registration.getStudentCode(),
                registration.getStudentName(),
                registration.getRegisteredAt(),
                registration.getAttendanceStatus().name()
        );
    }
}

