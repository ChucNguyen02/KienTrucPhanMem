import { apiClient } from './api/client';
import type { Campaign, CreateCampaignPayload, UpdateCampaignStatusPayload } from '../types/campaign';

export const campaignService = {
    async getCampaigns(): Promise<Campaign[]> {
        const response = await apiClient.get<Campaign[]>('/campaigns');
        return response.data;
    },

    async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
        const response = await apiClient.post<Campaign>('/campaigns', payload);
        return response.data;
    },

    async updateCampaignStatus(campaignId: number, payload: UpdateCampaignStatusPayload): Promise<Campaign> {
        const response = await apiClient.put<Campaign>(`/campaigns/${campaignId}/status`, payload);
        return response.data;
    },
};
