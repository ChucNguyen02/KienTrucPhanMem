package iuh.fit.backend.plugins.campaign.dto;

import iuh.fit.backend.plugins.campaign.entity.Campaign;
import iuh.fit.backend.plugins.campaign.entity.CampaignStatus;

import java.time.LocalDate;

public record CampaignResponse(
        Long id,
        String code,
        String name,
        LocalDate startDate,
        LocalDate endDate,
        CampaignStatus status,
        Integer maxParticipants,
        Integer pointPerAttendance
) {
    public static CampaignResponse from(Campaign campaign) {
        return new CampaignResponse(
                campaign.getId(),
                campaign.getCode(),
                campaign.getName(),
                campaign.getStartDate(),
                campaign.getEndDate(),
                campaign.getStatus(),
                campaign.getMaxParticipants(),
                campaign.getPointPerAttendance()
        );
    }
}

