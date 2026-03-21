import { apiClient, unwrap } from "./apiClient";
import type { Campaign, CampaignPayload } from "../types";

export const campaignService = {
    getAll: async () => unwrap<Campaign[]>((await apiClient.get("/api/campaigns"))),
    create: async (payload: CampaignPayload) => unwrap<Campaign>((await apiClient.post("/api/campaigns", payload))),
    update: async (id: number, payload: CampaignPayload) => unwrap<Campaign>((await apiClient.put(`/api/campaigns/${id}`, payload))),
    remove: async (id: number) => {
        await apiClient.delete(`/api/campaigns/${id}`);
    },
    setActive: async (id: number, value: boolean) =>
        unwrap<Campaign>((await apiClient.patch(`/api/campaigns/${id}/active`, undefined, { params: { value } }))),
};
