import { useCallback, useEffect, useMemo, useState } from 'react';
import { campaignService } from '../services/campaign.service';
import { reportService } from '../services/report.service';
import type { CampaignPointSummary, LeaderboardItem, StudentPointSummary } from '../types/report';

interface LeaderboardState {
    leaderboard: LeaderboardItem[];
    campaignSummary: CampaignPointSummary[];
    detailsByCampaign: StudentPointSummary[];
}

export function useLeaderboard() {
    const [state, setState] = useState<LeaderboardState>({
        leaderboard: [],
        campaignSummary: [],
        detailsByCampaign: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [campaigns, campaignSummary] = await Promise.all([
                campaignService.getCampaigns(),
                reportService.getCampaignPoints(),
            ]);

            const details = await Promise.all(
                campaigns.map((campaign) => reportService.getStudentPoints(campaign.id)),
            );
            const flattenDetails = details.flat();

            const aggregate = new Map<string, LeaderboardItem>();
            for (const row of flattenDetails) {
                const existing = aggregate.get(row.studentCode);
                if (!existing) {
                    aggregate.set(row.studentCode, {
                        studentCode: row.studentCode,
                        studentName: row.studentName,
                        attendanceCount: row.attendanceCount,
                        totalPoints: row.totalPoints,
                        campaigns: [row.campaignCode],
                    });
                    continue;
                }

                existing.attendanceCount += row.attendanceCount;
                existing.totalPoints += row.totalPoints;
                if (!existing.campaigns.includes(row.campaignCode)) {
                    existing.campaigns.push(row.campaignCode);
                }
            }

            const leaderboard = Array.from(aggregate.values()).sort((a, b) => {
                if (b.totalPoints === a.totalPoints) {
                    return b.attendanceCount - a.attendanceCount;
                }
                return b.totalPoints - a.totalPoints;
            });

            setState({
                leaderboard,
                campaignSummary,
                detailsByCampaign: flattenDetails,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Khong the tai du lieu bao cao');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadReports();
    }, [loadReports]);

    const topThree = useMemo(() => state.leaderboard.slice(0, 3), [state.leaderboard]);

    return {
        ...state,
        topThree,
        isLoading,
        error,
        loadReports,
    };
}
