export interface StudentPointSummary {
    campaignId: number;
    campaignCode: string;
    studentCode: string;
    studentName: string;
    attendanceCount: number;
    totalPoints: number;
}

export interface CampaignPointSummary {
    campaignId: number;
    campaignCode: string;
    campaignName: string;
    participants: number;
    totalAttendance: number;
    totalPoints: number;
}

export interface LeaderboardItem {
    studentCode: string;
    studentName: string;
    attendanceCount: number;
    totalPoints: number;
    campaigns: string[];
}
