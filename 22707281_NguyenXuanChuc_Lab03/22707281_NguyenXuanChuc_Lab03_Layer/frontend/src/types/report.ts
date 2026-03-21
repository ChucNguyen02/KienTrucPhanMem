export interface AttendanceReportItem {
    eventId: number;
    eventTitle: string;
    totalRegistered: number;
    totalCheckedIn: number;
}

export interface CampaignReportItem {
    campaignId: number;
    campaignName: string;
    totalEvents: number;
    totalRegistrations: number;
    totalCheckedIn: number;
}
