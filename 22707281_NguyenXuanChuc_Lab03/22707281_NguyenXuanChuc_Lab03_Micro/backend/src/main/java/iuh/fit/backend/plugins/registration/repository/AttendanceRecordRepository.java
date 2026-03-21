package iuh.fit.backend.plugins.registration.repository;

import iuh.fit.backend.plugins.registration.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByRegistrationId(Long registrationId);

    Optional<AttendanceRecord> findByRegistrationIdAndAttendanceDate(Long registrationId, java.time.LocalDate attendanceDate);
}

