import { useState, type FormEvent } from 'react';
import type { CreateCampaignPayload } from '../types/campaign';

interface CampaignFormProps {
    onSubmit: (payload: CreateCampaignPayload) => Promise<boolean>;
}

const initialForm: CreateCampaignPayload = {
    code: '',
    name: '',
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    pointPerAttendance: 10,
};

export function CampaignForm({ onSubmit }: CampaignFormProps) {
    const [form, setForm] = useState<CreateCampaignPayload>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        const ok = await onSubmit(form);
        setIsSubmitting(false);
        if (ok) {
            setForm(initialForm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
            <h2 className="md:col-span-2 text-xl font-semibold text-slate-900">Tao chien dich moi</h2>

            <label className="flex flex-col gap-1 text-sm font-medium">
                Ma chien dich
                <input
                    required
                    maxLength={50}
                    value={form.code}
                    onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                    placeholder="CD-2026-01"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
                Ten chien dich
                <input
                    required
                    maxLength={150}
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                    placeholder="Mua he xanh 2026"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
                Ngay bat dau
                <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
                Ngay ket thuc
                <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
                So luong toi da
                <input
                    required
                    min={1}
                    type="number"
                    value={form.maxParticipants}
                    onChange={(event) => setForm((prev) => ({ ...prev, maxParticipants: Number(event.target.value) }))}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
                Diem ren luyen / lan tham gia
                <input
                    required
                    min={0}
                    type="number"
                    value={form.pointPerAttendance}
                    onChange={(event) => setForm((prev) => ({ ...prev, pointPerAttendance: Number(event.target.value) }))}
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                />
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
                {isSubmitting ? 'Dang tao...' : 'Tao chien dich'}
            </button>
        </form>
    );
}
