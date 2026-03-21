import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { PageTitle, Panel, StatusBadge } from "../components/common";
import { campaignService, eventService, normalizeError, pointService, registrationService } from "../services";
import type { Campaign, Event, LeaderboardItem } from "../types";

export const HomePage = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [profile, setProfile] = useState({
        studentCode: "22707281",
        fullName: "Nguyen Van A",
        email: "sv22707281@iuh.edu.vn",
    });

    const loadData = async () => {
        setLoading(true);
        setError("");
        try {
            const [campaignData, eventData, leaderboardData] = await Promise.all([
                campaignService.getAll(),
                eventService.getAll(),
                pointService.getLeaderboard(10),
            ]);
            setCampaigns(campaignData);
            setEvents(eventData);
            setLeaderboard(leaderboardData);
        } catch (e) {
            setError(normalizeError(e));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const campaignMap = useMemo(() => new Map(campaigns.map((item) => [item.id, item])), [campaigns]);

    const handleRegister = async (eventId: number) => {
        setMessage("");
        setError("");

        try {
            await registrationService.register({
                eventId,
                studentCode: profile.studentCode.trim(),
                fullName: profile.fullName.trim(),
                email: profile.email.trim(),
            });
            setMessage("Dang ky thanh cong. Ban hay theo doi trang diem danh de cap nhat ket qua.");
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    return (
        <div className="space-y-6">
            <PageTitle
                title="Trang chu cong tac xa hoi"
                subtitle="Hien thi chien dich dang mo, su kien sap toi, nut dang ky nhanh va bang xep hang sinh vien tich cuc."
            />

            <Panel>
                <h2 className="mb-4 text-lg font-bold text-slate-900">Thong tin tai khoan de dang ky</h2>
                <div className="grid gap-3 md:grid-cols-3">
                    <input
                        className="rounded-xl border border-slate-300 px-3 py-2"
                        placeholder="Ma sinh vien"
                        value={profile.studentCode}
                        onChange={(e) => setProfile((prev) => ({ ...prev, studentCode: e.target.value }))}
                    />
                    <input
                        className="rounded-xl border border-slate-300 px-3 py-2"
                        placeholder="Ho ten"
                        value={profile.fullName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                    <input
                        className="rounded-xl border border-slate-300 px-3 py-2"
                        placeholder="Email"
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </div>
            </Panel>

            {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <Panel>
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Chien dich</h2>
                        <div className="space-y-3">
                            {campaigns.length === 0 && <p className="text-sm text-slate-500">Chua co chien dich nao.</p>}
                            {campaigns.map((campaign) => (
                                <article key={campaign.id} className="rounded-xl border border-slate-200 p-4">
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="font-bold text-slate-900">{campaign.name}</h3>
                                        <StatusBadge label={campaign.active ? "Dang mo" : "Tam khoa"} tone={campaign.active ? "green" : "red"} />
                                    </div>
                                    <p className="text-sm text-slate-600">{campaign.description || "Khong co mo ta."}</p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        {dayjs(campaign.startDate).format("DD/MM/YYYY")} - {dayjs(campaign.endDate).format("DD/MM/YYYY")}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </Panel>

                    <Panel>
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Su kien va dang ky tham gia</h2>
                        <div className="space-y-3">
                            {events.length === 0 && <p className="text-sm text-slate-500">Chua co su kien nao.</p>}
                            {events.map((event) => {
                                const linkedCampaign = event.campaignId ? campaignMap.get(event.campaignId) : undefined;
                                const datePassed = dayjs(event.eventDate).isBefore(dayjs());
                                const registrationClosed = datePassed || linkedCampaign?.active === false;

                                return (
                                    <article key={event.id} className="rounded-xl border border-slate-200 p-4">
                                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="font-semibold text-slate-900">{event.title}</h3>
                                            <StatusBadge label={registrationClosed ? "Dong dang ky" : "Mo dang ky"} tone={registrationClosed ? "red" : "green"} />
                                        </div>
                                        <p className="text-sm text-slate-600">Dia diem: {event.location}</p>
                                        <p className="text-sm text-slate-600">Thuoc chien dich: {event.campaignName ?? "Doc lap"}</p>
                                        <p className="text-xs text-slate-500">Thoi gian: {dayjs(event.eventDate).format("DD/MM/YYYY HH:mm")}</p>

                                        <button
                                            type="button"
                                            disabled={registrationClosed || loading}
                                            onClick={() => void handleRegister(event.id)}
                                            className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            Dang ky tham gia
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </Panel>
                </div>

                <Panel>
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Leaderboard</h2>
                    {leaderboard.length === 0 && <p className="text-sm text-slate-500">Chua co du lieu diem.</p>}
                    <ol className="space-y-2">
                        {leaderboard.map((item, index) => (
                            <li key={item.studentCode} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                                <div>
                                    <p className="text-xs text-slate-500">#{index + 1}</p>
                                    <p className="text-sm font-semibold text-slate-900">{item.studentCode}</p>
                                </div>
                                <StatusBadge label={`${item.balance} diem`} tone="blue" />
                            </li>
                        ))}
                    </ol>
                </Panel>
            </div>
        </div>
    );
};
