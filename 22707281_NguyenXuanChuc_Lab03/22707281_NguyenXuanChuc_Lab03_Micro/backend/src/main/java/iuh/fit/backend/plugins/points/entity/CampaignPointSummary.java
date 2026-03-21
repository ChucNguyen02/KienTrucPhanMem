package iuh.fit.backend.plugins.points.entity;

public record CampaignPointSummary(
        Long campaignId,
        String campaignCode,
        String campaignName,
        long participants,
        long totalAttendance,
        long totalPoints
) {
}

