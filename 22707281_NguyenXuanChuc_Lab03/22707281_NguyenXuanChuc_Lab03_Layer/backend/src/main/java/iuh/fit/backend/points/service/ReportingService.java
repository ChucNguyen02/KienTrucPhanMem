package iuh.fit.backend.points.service;

import iuh.fit.backend.points.dto.AttendanceReportItemResponse;
import iuh.fit.backend.points.dto.CampaignReportItemResponse;

import java.util.List;

public interface ReportingService {
    List<AttendanceReportItemResponse> getAttendanceReport();

    List<CampaignReportItemResponse> getCampaignReport();
}

