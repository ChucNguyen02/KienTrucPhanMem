import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { PageTitle, Panel, StatusBadge } from "../components/common";
import { eventService, normalizeError, pointService, registrationService } from "../services";
import type { Event, Registration } from "../types";

export const RegistrationAttendancePage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [pointValue, setPointValue] = useState(10);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await eventService.getAll();
                setEvents(data);
                if (data.length > 0) {
                    setSelectedEventId(String(data[0].id));
                }
            } catch (e) {
                setError(normalizeError(e));
            }
        };

        void loadEvents();
    }, []);

    const selectedEvent = useMemo(
        () => events.find((event) => String(event.id) === selectedEventId) ?? null,
        [events, selectedEventId],
    );

    const loadRegistrations = async (eventId: number) => {
        setError("");
        try {
            const data = await registrationService.getByEvent(eventId);
            setRegistrations(data);
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    useEffect(() => {
        if (selectedEventId) {
            queueMicrotask(() => {
                void loadRegistrations(Number(selectedEventId));
            });
        }
    }, [selectedEventId]);

    const updateStatus = async (id: number, action: "check-in" | "cancel") => {
        setMessage("");
        setError("");
        try {
            if (action === "check-in") {
                await registrationService.checkIn(id);
            } else {
                await registrationService.cancel(id);
            }

            if (selectedEventId) {
                await loadRegistrations(Number(selectedEventId));
            }
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    const awardPoints = async (registration: Registration) => {
        setMessage("");
        setError("");

        try {
            await pointService.earn({
                studentCode: registration.studentCode,
                points: pointValue,
                source: `Attendance event #${registration.eventId}`,
                registrationId: registration.id,
            });
            setMessage(`Da cong ${pointValue} diem cho ${registration.studentCode}.`);
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    return (
        <div className="space-y-6">
            <PageTitle
                title="Plugin 2: Registration & Attendance"
                subtitle="Quan ly danh sach dang ky theo event, cap nhat diem danh Tham gia/Vang mat, va cong diem cho nguoi da check-in."
            />

            {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <Panel>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Chon su kien</label>
                        <select
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                        >
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title} - {dayjs(event.eventDate).format("DD/MM/YYYY HH:mm")}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Diem thuong check-in</label>
                        <input
                            type="number"
                            min={1}
                            value={pointValue}
                            onChange={(e) => setPointValue(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2"
                        />
                    </div>
                </div>
            </Panel>

            {selectedEvent && (
                <Panel>
                    <h2 className="text-lg font-bold text-slate-900">{selectedEvent.title}</h2>
                    <p className="text-sm text-slate-600">
                        {selectedEvent.location} - {dayjs(selectedEvent.eventDate).format("DD/MM/YYYY HH:mm")}
                    </p>
                </Panel>
            )}

            <Panel>
                <h2 className="mb-4 text-lg font-bold text-slate-900">Danh sach dang ky</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="px-3 py-2">Sinh vien</th>
                                <th className="px-3 py-2">Lien he</th>
                                <th className="px-3 py-2">Dang ky luc</th>
                                <th className="px-3 py-2">Trang thai</th>
                                <th className="px-3 py-2">Thao tac</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((registration) => (
                                <tr key={registration.id} className="border-b border-slate-100">
                                    <td className="px-3 py-3">
                                        <p className="font-semibold text-slate-900">{registration.fullName}</p>
                                        <p className="text-xs text-slate-500">{registration.studentCode}</p>
                                    </td>
                                    <td className="px-3 py-3 text-slate-600">{registration.email}</td>
                                    <td className="px-3 py-3 text-slate-600">{dayjs(registration.registeredAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td className="px-3 py-3">
                                        <StatusBadge
                                            label={registration.status}
                                            tone={registration.status === "CHECKED_IN" ? "green" : registration.status === "REGISTERED" ? "yellow" : "red"}
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => void updateStatus(registration.id, "check-in")}
                                                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white"
                                            >
                                                Tham gia
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void updateStatus(registration.id, "cancel")}
                                                className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white"
                                            >
                                                Vang mat
                                            </button>
                                            <button
                                                type="button"
                                                disabled={registration.status !== "CHECKED_IN"}
                                                onClick={() => void awardPoints(registration)}
                                                className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                                            >
                                                Cong diem
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {registrations.length === 0 && (
                                <tr>
                                    <td className="px-3 py-4 text-slate-500" colSpan={5}>
                                        Chua co dang ky.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </div>
    );
};
