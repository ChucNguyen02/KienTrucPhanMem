export type CampaignStatus = 'PLANNED' | 'ACTIVE' | 'CLOSED';

export interface Campaign {
    id: number;
    code: string;
    name: string;
    startDate: string;
    endDate: string;
    status: CampaignStatus;
    maxParticipants: number;
    pointPerAttendance: number;
}

export interface CreateCampaignPayload {
    code: string;
    name: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    pointPerAttendance: number;
}

export interface UpdateCampaignStatusPayload {
    status: CampaignStatus;
}
