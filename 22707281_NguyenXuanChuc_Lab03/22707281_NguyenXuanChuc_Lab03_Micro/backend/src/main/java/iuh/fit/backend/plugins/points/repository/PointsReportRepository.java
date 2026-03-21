package iuh.fit.backend.plugins.points.repository;

import iuh.fit.backend.plugins.points.entity.CampaignPointSummary;
import iuh.fit.backend.plugins.points.entity.StudentPointSummary;
import iuh.fit.backend.plugins.registration.entity.Registration;
import iuh.fit.backend.plugins.registration.repository.AttendanceRecordRepository;
import iuh.fit.backend.plugins.registration.repository.RegistrationRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PointsReportRepository {

    private final RegistrationRepository registrationRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;

    public PointsReportRepository(
            RegistrationRepository registrationRepository,
            AttendanceRecordRepository attendanceRecordRepository
    ) {
        this.registrationRepository = registrationRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
    }

    public List<StudentPointSummary> getStudentPoints(Long campaignId) {
        List<Registration> registrations = registrationRepository.findByCampaignId(campaignId);
        List<StudentPointSummary> results = new ArrayList<>();

        for (Registration registration : registrations) {
            long attendanceCount = attendanceRecordRepository.findByRegistrationId(registration.getId()).stream()
                    .filter(a -> a.isPresent())
                    .count();
            long points = attendanceCount * registration.getCampaign().getPointPerAttendance();

            results.add(new StudentPointSummary(
                    registration.getCampaign().getId(),
                    registration.getCampaign().getCode(),
                    registration.getStudentCode(),
                    registration.getStudentName(),
                    attendanceCount,
                    points
            ));
        }

        return results;
    }

    public List<CampaignPointSummary> getCampaignPoints() {
        Map<Long, CampaignAccumulator> summaries = new LinkedHashMap<>();

        for (Registration registration : registrationRepository.findAll()) {
            long attendanceCount = attendanceRecordRepository.findByRegistrationId(registration.getId()).stream()
                    .filter(a -> a.isPresent())
                    .count();
            long points = attendanceCount * registration.getCampaign().getPointPerAttendance();

            CampaignAccumulator accumulator = summaries.computeIfAbsent(
                    registration.getCampaign().getId(),
                    ignored -> new CampaignAccumulator(
                            registration.getCampaign().getId(),
                            registration.getCampaign().getCode(),
                            registration.getCampaign().getName()
                    )
            );

            accumulator.participants++;
            accumulator.totalAttendance += attendanceCount;
            accumulator.totalPoints += points;
        }

        return summaries.values().stream().map(CampaignAccumulator::toSummary).toList();
    }

    private static class CampaignAccumulator {
        private final Long campaignId;
        private final String campaignCode;
        private final String campaignName;
        private long participants;
        private long totalAttendance;
        private long totalPoints;

        private CampaignAccumulator(Long campaignId, String campaignCode, String campaignName) {
            this.campaignId = campaignId;
            this.campaignCode = campaignCode;
            this.campaignName = campaignName;
        }

        private CampaignPointSummary toSummary() {
            return new CampaignPointSummary(campaignId, campaignCode, campaignName, participants, totalAttendance, totalPoints);
        }
    }
}

