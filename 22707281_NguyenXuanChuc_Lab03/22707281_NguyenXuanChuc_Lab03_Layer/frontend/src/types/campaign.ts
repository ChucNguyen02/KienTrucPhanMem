export interface Campaign {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
}

export interface CampaignPayload {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
}
