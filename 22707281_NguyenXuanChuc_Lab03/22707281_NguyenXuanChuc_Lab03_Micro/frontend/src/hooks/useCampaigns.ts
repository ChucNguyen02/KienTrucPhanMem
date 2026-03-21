import { useCallback, useEffect, useMemo, useState } from 'react';
import { campaignService } from '../services/campaign.service';
import { registrationService } from '../services/registration.service';
import type { Campaign, CampaignStatus, CreateCampaignPayload } from '../types/campaign';
import { isCampaignExpired } from '../utils/campaign';

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [participantCountByCampaign, setParticipantCountByCampaign] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCampaigns = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const campaignData = await campaignService.getCampaigns();
            setCampaigns(campaignData);

            const registrationResults = await Promise.all(
                campaignData.map(async (campaign) => {
                    const registrations = await registrationService.getRegistrationsByCampaign(campaign.id);
                    return [campaign.id, registrations.length] as const;
                }),
            );

            const participantMap = Object.fromEntries(registrationResults);
            setParticipantCountByCampaign(participantMap);

            const campaignsToClose = campaignData.filter((campaign) => {
                if (campaign.status === 'CLOSED') {
                    return false;
                }
                const totalRegistered = participantMap[campaign.id] ?? 0;
                return isCampaignExpired(campaign) || totalRegistered >= campaign.maxParticipants;
            });

            if (campaignsToClose.length > 0) {
                await Promise.all(
                    campaignsToClose.map((campaign) =>
                        campaignService.updateCampaignStatus(campaign.id, {
                            status: 'CLOSED',
                        }),
                    ),
                );
                const refreshedCampaigns = await campaignService.getCampaigns();
                setCampaigns(refreshedCampaigns);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Khong the tai danh sach chien dich');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCampaigns();
    }, [loadCampaigns]);

    const createCampaign = async (payload: CreateCampaignPayload): Promise<boolean> => {
        try {
            await campaignService.createCampaign(payload);
            await loadCampaigns();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Tao chien dich that bai');
            return false;
        }
    };

    const updateStatus = async (campaignId: number, status: CampaignStatus): Promise<boolean> => {
        try {
            await campaignService.updateCampaignStatus(campaignId, { status });
            await loadCampaigns();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cap nhat trang thai that bai');
            return false;
        }
    };

    const campaignMap = useMemo(() => {
        return new Map(campaigns.map((campaign) => [campaign.id, campaign]));
    }, [campaigns]);

    return {
        campaigns,
        campaignMap,
        participantCountByCampaign,
        isLoading,
        error,
        loadCampaigns,
        createCampaign,
        updateStatus,
    };
}
