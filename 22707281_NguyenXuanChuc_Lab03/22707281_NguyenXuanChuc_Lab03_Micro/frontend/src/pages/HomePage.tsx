import { useMemo, useState } from 'react';
import { CampaignCard } from '../components/CampaignCard';
import { StudentProfilePanel } from '../components/StudentProfilePanel';
import { useCampaigns } from '../hooks/useCampaigns';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { registrationService } from '../services/registration.service';

export function HomePage() {
    const { profile, updateProfile } = useStudentProfile();
    const { campaigns, participantCountByCampaign, loadCampaigns, isLoading, error } = useCampaigns();
    const { topThree, loadReports } = useLeaderboard();
    const [registeringCampaignId, setRegisteringCampaignId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const sortedCampaigns = useMemo(
        () => [...campaigns].sort((a, b) => a.startDate.localeCompare(b.startDate)),
        [campaigns],
    );

    const handleRegister = async (campaignId: number) => {
        setRegisteringCampaignId(campaignId);
        setFeedback(null);
        try {
            await registrationService.register({
                campaignId,
                studentCode: profile.studentCode,
                studentName: profile.studentName,
            });
            setFeedback('Dang ky thanh cong!');
            await Promise.all([loadCampaigns(), loadReports()]);
        } catch (err) {
            setFeedback(err instanceof Error ? err.message : 'Dang ky that bai');
        } finally {
            setRegisteringCampaignId(null);
        }
    };

    return (
        <div className="space-y-6">
            <StudentProfilePanel profile={profile} onSave={updateProfile} />

            <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Leaderboard</p>
                    <h2 className="mt-2 text-xl font-semibold">Top sinh vien tich cuc</h2>
                </div>
                <div className="md:col-span-2 grid gap-3 sm:grid-cols-3">
                    {topThree.length === 0 ? (
                        <p className="text-sm text-slate-500">Chua co du lieu diem danh.</p>
                    ) : (
                        topThree.map((item, index) => (
                            <article key={item.studentCode} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                <p className="text-xs font-semibold uppercase text-amber-700">Hang #{index + 1}</p>
                                <p className="mt-1 text-sm font-bold text-slate-900">{item.studentName}</p>
                                <p className="text-xs text-slate-600">{item.studentCode}</p>
                                <p className="mt-2 text-sm text-slate-700">Tong diem: {item.totalPoints}</p>
                            </article>
                        ))
                    )}
                </div>
            </section>

            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-slate-900">Danh sach chien dich</h2>
                    {isLoading ? <p className="text-sm text-slate-500">Dang tai...</p> : null}
                </div>

                {feedback ? <p className="mb-3 text-sm font-medium text-sky-700">{feedback}</p> : null}
                {error ? <p className="mb-3 text-sm font-medium text-rose-600">{error}</p> : null}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {sortedCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            currentParticipants={participantCountByCampaign[campaign.id] ?? 0}
                            isRegistering={registeringCampaignId === campaign.id}
                            onRegister={handleRegister}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
