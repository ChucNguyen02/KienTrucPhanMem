export interface Event {
    id: number;
    title: string;
    location: string;
    eventDate: string;
    campaignId: number | null;
    campaignName: string | null;
}

export interface EventPayload {
    title: string;
    location: string;
    eventDate: string;
    campaignId?: number;
}
