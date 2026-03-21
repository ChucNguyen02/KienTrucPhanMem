package iuh.fit.backend.plugins.registration.service;

import iuh.fit.backend.common.ResourceNotFoundException;
import iuh.fit.backend.plugins.campaign.entity.Campaign;
import iuh.fit.backend.plugins.campaign.service.CampaignService;
import iuh.fit.backend.plugins.registration.dto.AttendanceRecordResponse;
import iuh.fit.backend.plugins.registration.dto.CreateRegistrationRequest;
import iuh.fit.backend.plugins.registration.dto.MarkAttendanceRequest;
import iuh.fit.backend.plugins.registration.dto.RegistrationResponse;
import iuh.fit.backend.plugins.registration.entity.AttendanceRecord;
import iuh.fit.backend.plugins.registration.entity.AttendanceStatus;
import iuh.fit.backend.plugins.registration.entity.Registration;
import iuh.fit.backend.plugins.registration.repository.AttendanceRecordRepository;
import iuh.fit.backend.plugins.registration.repository.RegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final CampaignService campaignService;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            AttendanceRecordRepository attendanceRecordRepository,
            CampaignService campaignService
    ) {
        this.registrationRepository = registrationRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.campaignService = campaignService;
    }

    @Transactional
    public RegistrationResponse register(CreateRegistrationRequest request) {
        Campaign campaign = campaignService.getById(request.campaignId());

        registrationRepository.findByCampaignIdAndStudentCode(request.campaignId(), request.studentCode())
                .ifPresent(reg -> {
                    throw new IllegalArgumentException("Student already registered in this campaign");
                });

        long currentCount = registrationRepository.findByCampaignId(request.campaignId()).size();
        if (currentCount >= campaign.getMaxParticipants()) {
            throw new IllegalArgumentException("Campaign reached max participants");
        }

        Registration registration = new Registration();
        registration.setCampaign(campaign);
        registration.setStudentCode(request.studentCode());
        registration.setStudentName(request.studentName());
        registration.setRegisteredAt(LocalDateTime.now());
        registration.setAttendanceStatus(AttendanceStatus.PENDING);

        return RegistrationResponse.from(registrationRepository.save(registration));
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> findByCampaign(Long campaignId) {
        return registrationRepository.findByCampaignId(campaignId).stream()
                .map(RegistrationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordResponse> findAttendanceByRegistration(Long registrationId) {
        return attendanceRecordRepository.findByRegistrationId(registrationId).stream()
                .map(AttendanceRecordResponse::from)
                .toList();
    }

    @Transactional
    public AttendanceRecordResponse markAttendance(Long registrationId, MarkAttendanceRequest request) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id=" + registrationId));

        AttendanceRecord attendanceRecord = attendanceRecordRepository
                .findByRegistrationIdAndAttendanceDate(registrationId, request.attendanceDate())
                .orElseGet(AttendanceRecord::new);

        attendanceRecord.setRegistration(registration);
        attendanceRecord.setAttendanceDate(request.attendanceDate());
        attendanceRecord.setPresent(request.present());

        registration.setAttendanceStatus(request.present() ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT);
        registrationRepository.save(registration);

        return AttendanceRecordResponse.from(attendanceRecordRepository.save(attendanceRecord));
    }
}

