package iuh.fit.backend.points.controller;

import iuh.fit.backend.common.ApiResponse;
import iuh.fit.backend.points.dto.AttendanceReportItemResponse;
import iuh.fit.backend.points.dto.CampaignReportItemResponse;
import iuh.fit.backend.points.service.ReportingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportingService reportingService;

    public ReportController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/attendance")
    public ResponseEntity<ApiResponse<List<AttendanceReportItemResponse>>> getAttendanceReport() {
        return ResponseEntity.ok(new ApiResponse<>("Attendance report", reportingService.getAttendanceReport()));
    }

    @GetMapping("/campaigns")
    public ResponseEntity<ApiResponse<List<CampaignReportItemResponse>>> getCampaignReport() {
        return ResponseEntity.ok(new ApiResponse<>("Campaign report", reportingService.getCampaignReport()));
    }
}

