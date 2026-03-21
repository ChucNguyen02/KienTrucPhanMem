import { apiClient, unwrap } from "./apiClient";
import type { AttendanceReportItem, CampaignReportItem } from "../types";

export const reportService = {
    getAttendance: async () =>
        unwrap<AttendanceReportItem[]>((await apiClient.get("/api/reports/attendance"))),
    getCampaigns: async () =>
        unwrap<CampaignReportItem[]>((await apiClient.get("/api/reports/campaigns"))),
};
