package iuh.fit.backend.plugins.points.controller;

import iuh.fit.backend.plugins.points.entity.CampaignPointSummary;
import iuh.fit.backend.plugins.points.entity.StudentPointSummary;
import iuh.fit.backend.plugins.points.service.PointsReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class PointsReportController {

    private final PointsReportService pointsReportService;

    public PointsReportController(PointsReportService pointsReportService) {
        this.pointsReportService = pointsReportService;
    }

    @GetMapping("/student-points")
    public List<StudentPointSummary> getStudentPoints(@RequestParam Long campaignId) {
        return pointsReportService.getStudentPoints(campaignId);
    }

    @GetMapping("/campaign-points")
    public List<CampaignPointSummary> getCampaignPoints() {
        return pointsReportService.getCampaignPoints();
    }
}

