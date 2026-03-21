package iuh.fit.backend.points.dto;

public record AttendanceReportItemResponse(
        Long eventId,
        String eventTitle,
        long totalRegistered,
        long totalCheckedIn
) {
}

