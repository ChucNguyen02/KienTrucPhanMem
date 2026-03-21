package iuh.fit.backend.plugins.points.service;

import iuh.fit.backend.plugins.points.entity.CampaignPointSummary;
import iuh.fit.backend.plugins.points.entity.StudentPointSummary;
import iuh.fit.backend.plugins.points.repository.PointsReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PointsReportService {

    private final PointsReportRepository pointsReportRepository;

    public PointsReportService(PointsReportRepository pointsReportRepository) {
        this.pointsReportRepository = pointsReportRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentPointSummary> getStudentPoints(Long campaignId) {
        return pointsReportRepository.getStudentPoints(campaignId);
    }

    @Transactional(readOnly = true)
    public List<CampaignPointSummary> getCampaignPoints() {
        return pointsReportRepository.getCampaignPoints();
    }
}

