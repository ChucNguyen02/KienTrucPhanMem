package iuh.fit.backend.plugins.registration.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MarkAttendanceRequest(
        @NotNull LocalDate attendanceDate,
        @NotNull Boolean present
) {
}

