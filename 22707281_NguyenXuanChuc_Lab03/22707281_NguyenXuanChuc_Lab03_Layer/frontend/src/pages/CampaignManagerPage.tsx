import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PageTitle, Panel, StatusBadge } from "../components/common";
import { campaignService, eventService, normalizeError } from "../services";
import type { Campaign, Event } from "../types";

interface CampaignFormState {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
    volunteerLimit: number;
    rewardPoints: number;
}

interface EventFormState {
    title: string;
    location: string;
    eventDate: string;
    campaignId: string;
}

const initialCampaignForm: CampaignFormState = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    active: true,
    volunteerLimit: 100,
    rewardPoints: 10,
};

const initialEventForm: EventFormState = {
    title: "",
    location: "",
    eventDate: "",
    campaignId: "",
};

export const CampaignManagerPage = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [campaignForm, setCampaignForm] = useState(initialCampaignForm);
    const [eventForm, setEventForm] = useState(initialEventForm);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = async () => {
        try {
            const [campaignData, eventData] = await Promise.all([campaignService.getAll(), eventService.getAll()]);
            setCampaigns(campaignData);
            setEvents(eventData);
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            void loadData();
        });
    }, []);

    const submitCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const meta = `Volunteer limit: ${campaignForm.volunteerLimit}, Reward points: ${campaignForm.rewardPoints}`;
        const description = campaignForm.description
            ? `${campaignForm.description}\n${meta}`
            : meta;

        try {
            await campaignService.create({
                name: campaignForm.name,
                description,
                startDate: campaignForm.startDate,
                endDate: campaignForm.endDate,
                active: campaignForm.active,
            });
            setCampaignForm(initialCampaignForm);
            setMessage("Tao campaign thanh cong.");
            await loadData();
        } catch (err) {
            setError(normalizeError(err));
        }
    };

    const submitEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            await eventService.create({
                title: eventForm.title,
                location: eventForm.location,
                eventDate: eventForm.eventDate,
                campaignId: eventForm.campaignId ? Number(eventForm.campaignId) : undefined,
            });
            setEventForm(initialEventForm);
            setMessage("Tao event thanh cong.");
            await loadData();
        } catch (err) {
            setError(normalizeError(err));
        }
    };

    const toggleCampaign = async (campaign: Campaign) => {
        setError("");
        try {
            await campaignService.setActive(campaign.id, !campaign.active);
            await loadData();
        } catch (err) {
            setError(normalizeError(err));
        }
    };

    return (
        <div className="space-y-6">
            <PageTitle
                title="Plugin 1: Campaign Manager"
                subtitle="Quan ly chien dich va su kien. Form admin gom ten chien dich, thoi gian, dia diem su kien, gioi han so luong TNV va diem ren luyen."
            />

            {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <div className="grid gap-6 lg:grid-cols-2">
                <Panel>
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Them chien dich</h2>
                    <form className="space-y-3" onSubmit={submitCampaign}>
                        <input
                            required
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            placeholder="Ten chien dich"
                            value={campaignForm.name}
                            onChange={(e) => setCampaignForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <textarea
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            placeholder="Mo ta"
                            value={campaignForm.description}
                            onChange={(e) => setCampaignForm((prev) => ({ ...prev, description: e.target.value }))}
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input
                                required
                                type="date"
                                className="rounded-xl border border-slate-300 px-3 py-2"
                                value={campaignForm.startDate}
                                onChange={(e) => setCampaignForm((prev) => ({ ...prev, startDate: e.target.value }))}
                            />
                            <input
                                required
                                type="date"
                                className="rounded-xl border border-slate-300 px-3 py-2"
                                value={campaignForm.endDate}
                                onChange={(e) => setCampaignForm((prev) => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <input
                                type="number"
                                min={1}
                                className="rounded-xl border border-slate-300 px-3 py-2"
                                value={campaignForm.volunteerLimit}
                                onChange={(e) => setCampaignForm((prev) => ({ ...prev, volunteerLimit: Number(e.target.value) }))}
                                placeholder="So luong TNV toi da"
                            />
                            <input
                                type="number"
                                min={1}
                                className="rounded-xl border border-slate-300 px-3 py-2"
                                value={campaignForm.rewardPoints}
                                onChange={(e) => setCampaignForm((prev) => ({ ...prev, rewardPoints: Number(e.target.value) }))}
                                placeholder="Diem ren luyen"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={campaignForm.active}
                                onChange={(e) => setCampaignForm((prev) => ({ ...prev, active: e.target.checked }))}
                            />
                            Mo campaign ngay sau khi tao
                        </label>
                        <button className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white" type="submit">
                            Tao campaign
                        </button>
                    </form>
                </Panel>

                <Panel>
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Them su kien</h2>
                    <form className="space-y-3" onSubmit={submitEvent}>
                        <input
                            required
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            placeholder="Ten su kien"
                            value={eventForm.title}
                            onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                        />
                        <input
                            required
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            placeholder="Dia diem"
                            value={eventForm.location}
                            onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                        />
                        <input
                            required
                            type="datetime-local"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            value={eventForm.eventDate}
                            onChange={(e) => setEventForm((prev) => ({ ...prev, eventDate: e.target.value }))}
                        />
                        <select
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            value={eventForm.campaignId}
                            onChange={(e) => setEventForm((prev) => ({ ...prev, campaignId: e.target.value }))}
                        >
                            <option value="">Khong gan campaign</option>
                            {campaigns.map((campaign) => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.name}
                                </option>
                            ))}
                        </select>
                        <button className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white" type="submit">
                            Tao su kien
                        </button>
                    </form>
                </Panel>
            </div>

            <Panel>
                <h2 className="mb-4 text-lg font-bold text-slate-900">Danh sach campaign</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="px-3 py-2">Ten</th>
                                <th className="px-3 py-2">Thoi gian</th>
                                <th className="px-3 py-2">Trang thai</th>
                                <th className="px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-b border-slate-100">
                                    <td className="px-3 py-3">
                                        <p className="font-semibold">{campaign.name}</p>
                                        <p className="text-xs text-slate-500">{campaign.description}</p>
                                    </td>
                                    <td className="px-3 py-3">
                                        {dayjs(campaign.startDate).format("DD/MM/YYYY")} - {dayjs(campaign.endDate).format("DD/MM/YYYY")}
                                    </td>
                                    <td className="px-3 py-3">
                                        <StatusBadge label={campaign.active ? "Dang mo" : "Tam khoa"} tone={campaign.active ? "green" : "red"} />
                                    </td>
                                    <td className="px-3 py-3">
                                        <button
                                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold"
                                            type="button"
                                            onClick={() => void toggleCampaign(campaign)}
                                        >
                                            {campaign.active ? "Dong" : "Mo"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>

            <Panel>
                <h2 className="mb-4 text-lg font-bold text-slate-900">Danh sach event</h2>
                <div className="space-y-2">
                    {events.map((event) => (
                        <article key={event.id} className="rounded-xl border border-slate-200 px-4 py-3">
                            <p className="font-semibold text-slate-900">{event.title}</p>
                            <p className="text-sm text-slate-600">
                                {event.location} - {dayjs(event.eventDate).format("DD/MM/YYYY HH:mm")}
                            </p>
                            <p className="text-xs text-slate-500">Campaign: {event.campaignName ?? "Doc lap"}</p>
                        </article>
                    ))}
                </div>
            </Panel>
        </div>
    );
};
