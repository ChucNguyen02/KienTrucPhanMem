package iuh.fit.backend.plugins.points.entity;

public record StudentPointSummary(
        Long campaignId,
        String campaignCode,
        String studentCode,
        String studentName,
        long attendanceCount,
        long totalPoints
) {
}

