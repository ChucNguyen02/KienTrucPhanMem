package iuh.fit.backend.plugins.registration.dto;

import iuh.fit.backend.plugins.registration.entity.AttendanceRecord;

import java.time.LocalDate;

public record AttendanceRecordResponse(
        Long id,
        Long registrationId,
        LocalDate attendanceDate,
        boolean present
) {
    public static AttendanceRecordResponse from(AttendanceRecord attendanceRecord) {
        return new AttendanceRecordResponse(
                attendanceRecord.getId(),
                attendanceRecord.getRegistration().getId(),
                attendanceRecord.getAttendanceDate(),
                attendanceRecord.isPresent()
        );
    }
}

