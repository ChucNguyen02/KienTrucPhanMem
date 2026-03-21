import { useEffect, useMemo, useState } from 'react';
import { useCampaigns } from '../hooks/useCampaigns';
import { registrationService } from '../services/registration.service';
import type { Registration } from '../types/registration';
import { formatDateTime } from '../utils/format';

export function RegistrationAttendancePage() {
    const { campaigns, isLoading: campaignLoading } = useCampaigns();
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (campaigns.length > 0 && selectedCampaignId === null) {
            setSelectedCampaignId(campaigns[0].id);
        }
    }, [campaigns, selectedCampaignId]);

    const loadRegistrations = async (campaignId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await registrationService.getRegistrationsByCampaign(campaignId);
            setRegistrations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Khong the tai danh sach dang ky');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCampaignId === null) {
            return;
        }
        void loadRegistrations(selectedCampaignId);
    }, [selectedCampaignId]);

    const selectedCampaign = useMemo(
        () => campaigns.find((campaign) => campaign.id === selectedCampaignId),
        [campaigns, selectedCampaignId],
    );

    const handleMarkAttendance = async (registrationId: number, present: boolean) => {
        if (selectedCampaignId === null) {
            return;
        }

        try {
            await registrationService.markAttendance(registrationId, {
                attendanceDate: new Date().toISOString().slice(0, 10),
                present,
            });
            await loadRegistrations(selectedCampaignId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Cap nhat diem danh that bai');
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Registration & Attendance</h2>
                <p className="mt-1 text-sm text-slate-600">
                    Chon chien dich de duyet danh sach dang ky va cap nhat trang thai tham gia.
                </p>

                <div className="mt-4 max-w-sm">
                    <select
                        value={selectedCampaignId ?? ''}
                        onChange={(event) => setSelectedCampaignId(Number(event.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
                    >
                        {campaigns.map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                                {campaign.code} - {campaign.name}
                            </option>
                        ))}
                    </select>
                </div>

                {campaignLoading || isLoading ? <p className="mt-3 text-sm text-slate-500">Dang tai du lieu...</p> : null}
                {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Danh sach dang ky {selectedCampaign ? `- ${selectedCampaign.code}` : ''}
                    </h3>
                    <span className="text-sm text-slate-500">Tong: {registrations.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="px-3 py-2">Sinh vien</th>
                                <th className="px-3 py-2">Thoi gian dang ky</th>
                                <th className="px-3 py-2">Trang thai</th>
                                <th className="px-3 py-2">Diem danh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {registrations.map((registration) => (
                                <tr key={registration.id}>
                                    <td className="px-3 py-3">
                                        <p className="font-semibold text-slate-900">{registration.studentName}</p>
                                        <p className="text-slate-600">{registration.studentCode}</p>
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">{formatDateTime(registration.registeredAt)}</td>
                                    <td className="px-3 py-3 text-slate-700">{registration.attendanceStatus}</td>
                                    <td className="px-3 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => void handleMarkAttendance(registration.id, true)}
                                                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                                            >
                                                Co mat
                                            </button>
                                            <button
                                                onClick={() => void handleMarkAttendance(registration.id, false)}
                                                className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                                            >
                                                Vang
                                            </button>
                                        </div>
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
