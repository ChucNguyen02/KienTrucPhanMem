import { apiClient } from './api/client';
import type { CampaignPointSummary, StudentPointSummary } from '../types/report';

export const reportService = {
    async getCampaignPoints(): Promise<CampaignPointSummary[]> {
        const response = await apiClient.get<CampaignPointSummary[]>('/reports/campaign-points');
        return response.data;
    },

    async getStudentPoints(campaignId: number): Promise<StudentPointSummary[]> {
        const response = await apiClient.get<StudentPointSummary[]>('/reports/student-points', {
            params: { campaignId },
        });
        return response.data;
    },
};
