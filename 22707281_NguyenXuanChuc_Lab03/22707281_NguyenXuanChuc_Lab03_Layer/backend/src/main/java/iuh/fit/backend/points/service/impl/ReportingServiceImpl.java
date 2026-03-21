package iuh.fit.backend.points.service.impl;

import iuh.fit.backend.campaign.entity.Campaign;
import iuh.fit.backend.campaign.repository.CampaignRepository;
import iuh.fit.backend.points.dto.AttendanceReportItemResponse;
import iuh.fit.backend.points.dto.CampaignReportItemResponse;
import iuh.fit.backend.points.service.ReportingService;
import iuh.fit.backend.registration.entity.Event;
import iuh.fit.backend.registration.entity.RegistrationStatus;
import iuh.fit.backend.registration.repository.EventRepository;
import iuh.fit.backend.registration.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportingServiceImpl implements ReportingService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final CampaignRepository campaignRepository;

    public ReportingServiceImpl(EventRepository eventRepository,
                                RegistrationRepository registrationRepository,
                                CampaignRepository campaignRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.campaignRepository = campaignRepository;
    }

    @Override
    public List<AttendanceReportItemResponse> getAttendanceReport() {
        List<Event> events = eventRepository.findAllByOrderByEventDateAsc();
        return events.stream().map(event -> new AttendanceReportItemResponse(
                event.getId(),
                event.getTitle(),
                registrationRepository.countByEventId(event.getId()),
                registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.CHECKED_IN)
        )).toList();
    }

    @Override
    public List<CampaignReportItemResponse> getCampaignReport() {
        List<Campaign> campaigns = campaignRepository.findAllByOrderByStartDateDesc();
        return campaigns.stream().map(campaign -> new CampaignReportItemResponse(
                campaign.getId(),
                campaign.getName(),
                eventRepository.countByCampaignId(campaign.getId()),
                registrationRepository.countByEventCampaignId(campaign.getId()),
                registrationRepository.countByEventCampaignIdAndStatus(campaign.getId(), RegistrationStatus.CHECKED_IN)
        )).toList();
    }
}

