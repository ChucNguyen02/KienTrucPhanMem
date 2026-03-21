import { useState } from 'react';
import { CampaignForm } from '../components/CampaignForm';
import { StatusBadge } from '../components/StatusBadge';
import { useCampaigns } from '../hooks/useCampaigns';
import type { CampaignStatus } from '../types/campaign';
import { formatDate } from '../utils/format';

const statusOptions: CampaignStatus[] = ['PLANNED', 'ACTIVE', 'CLOSED'];

export function CampaignManagerPage() {
    const { campaigns, participantCountByCampaign, createCampaign, updateStatus, isLoading, error } = useCampaigns();
    const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

    const handleStatusChange = async (campaignId: number, status: CampaignStatus) => {
        setStatusUpdatingId(campaignId);
        await updateStatus(campaignId, status);
        setStatusUpdatingId(null);
    };

    return (
        <div className="space-y-6">
            <CampaignForm onSubmit={createCampaign} />

            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">Quan ly trang thai chien dich</h2>
                    {isLoading ? <p className="text-sm text-slate-500">Dang tai...</p> : null}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="px-3 py-2">Campaign</th>
                                <th className="px-3 py-2">Thoi gian</th>
                                <th className="px-3 py-2">So luong</th>
                                <th className="px-3 py-2">Trang thai</th>
                                <th className="px-3 py-2">Cap nhat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td className="px-3 py-3">
                                        <p className="font-semibold text-slate-900">{campaign.code}</p>
                                        <p className="text-slate-600">{campaign.name}</p>
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">
                                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">
                                        {participantCountByCampaign[campaign.id] ?? 0}/{campaign.maxParticipants}
                                    </td>
                                    <td className="px-3 py-3">
                                        <StatusBadge text={campaign.status} />
                                    </td>
                                    <td className="px-3 py-3">
                                        <select
                                            value={campaign.status}
                                            disabled={statusUpdatingId === campaign.id}
                                            onChange={(event) => void handleStatusChange(campaign.id, event.target.value as CampaignStatus)}
                                            className="rounded-md border border-slate-300 px-2 py-1 outline-none focus:border-sky-500"
                                        >
                                            {statusOptions.map((statusOption) => (
                                                <option key={statusOption} value={statusOption}>
                                                    {statusOption}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
