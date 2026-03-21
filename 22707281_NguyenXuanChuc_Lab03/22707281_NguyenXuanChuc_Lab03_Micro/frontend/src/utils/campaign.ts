import type { Campaign } from '../types/campaign';

export function isCampaignExpired(campaign: Campaign): boolean {
    return new Date(campaign.endDate).getTime() < Date.now();
}

export function canRegisterForCampaign(
    campaign: Campaign,
    currentParticipants: number,
): { canRegister: boolean; reason?: string } {
    if (campaign.status === 'CLOSED') {
        return { canRegister: false, reason: 'Chiến dịch đã đóng' };
    }

    if (isCampaignExpired(campaign)) {
        return { canRegister: false, reason: 'Chiến dịch đã hết hạn' };
    }

    if (currentParticipants >= campaign.maxParticipants) {
        return { canRegister: false, reason: 'Đã đủ số lượng tình nguyện viên' };
    }

    return { canRegister: true };
}
