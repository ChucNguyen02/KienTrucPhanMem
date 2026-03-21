package iuh.fit.backend.points.dto;

public record CampaignReportItemResponse(
        Long campaignId,
        String campaignName,
        long totalEvents,
        long totalRegistrations,
        long totalCheckedIn
) {
}

