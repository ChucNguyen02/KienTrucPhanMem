import { apiClient, unwrap } from "./apiClient";
import type { LeaderboardItem, PointBalance, PointPayload, PointTransaction } from "../types";

export const pointService = {
    earn: async (payload: PointPayload) =>
        unwrap<PointTransaction>((await apiClient.post("/api/points/earn", payload))),
    deduct: async (payload: PointPayload) =>
        unwrap<PointTransaction>((await apiClient.post("/api/points/deduct", payload))),
    getBalance: async (studentCode: string) =>
        unwrap<PointBalance>((await apiClient.get(`/api/points/balance/${studentCode}`))),
    getHistory: async (studentCode: string) =>
        unwrap<PointTransaction[]>((await apiClient.get(`/api/points/history/${studentCode}`))),
    getLeaderboard: async (limit = 10) =>
        unwrap<LeaderboardItem[]>((await apiClient.get("/api/points/leaderboard", { params: { limit } }))),
};
