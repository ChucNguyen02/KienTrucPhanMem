import type { Campaign } from '../types/campaign';
import { canRegisterForCampaign } from '../utils/campaign';
import { formatDate } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface CampaignCardProps {
    campaign: Campaign;
    currentParticipants: number;
    isRegistering: boolean;
    onRegister: (campaignId: number) => Promise<void>;
}

function statusTone(status: Campaign['status']): 'neutral' | 'success' | 'danger' | 'warning' {
    if (status === 'ACTIVE') return 'success';
    if (status === 'CLOSED') return 'danger';
    return 'warning';
}

export function CampaignCard({ campaign, currentParticipants, isRegistering, onRegister }: CampaignCardProps) {
    const registerState = canRegisterForCampaign(campaign, currentParticipants);

    return (
        <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{campaign.code}</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">{campaign.name}</h3>
                    </div>
                    <StatusBadge text={campaign.status} tone={statusTone(campaign.status)} />
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                        <span className="font-medium text-slate-800">Thoi gian:</span> {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">So luong:</span> {currentParticipants}/{campaign.maxParticipants}
                    </p>
                    <p>
                        <span className="font-medium text-slate-800">Diem:</span> {campaign.pointPerAttendance} diem/lan
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <button
                    disabled={!registerState.canRegister || isRegistering}
                    onClick={() => void onRegister(campaign.id)}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isRegistering ? 'Dang xu ly...' : 'Dang ky tham gia'}
                </button>
                {!registerState.canRegister && registerState.reason ? (
                    <p className="mt-2 text-xs text-rose-600">{registerState.reason}</p>
                ) : null}
            </div>
        </article>
    );
}
