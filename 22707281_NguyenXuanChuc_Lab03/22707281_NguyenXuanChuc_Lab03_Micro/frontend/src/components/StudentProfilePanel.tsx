import { useState, type FormEvent } from 'react';
import type { StudentProfile } from '../types/student';

interface StudentProfilePanelProps {
    profile: StudentProfile;
    onSave: (value: StudentProfile) => void;
}

export function StudentProfilePanel({ profile, onSave }: StudentProfilePanelProps) {
    const [form, setForm] = useState(profile);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.studentCode.trim() || !form.studentName.trim()) {
            return;
        }
        onSave({
            studentCode: form.studentCode.trim(),
            studentName: form.studentName.trim(),
        });
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Thong tin tai khoan sinh vien</h2>
            <p className="mt-1 text-sm text-slate-500">
                Du lieu nay duoc dung de dang ky tham gia chien dich.
            </p>

            <form className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    MSSV
                    <input
                        value={form.studentCode}
                        onChange={(event) => setForm((prev) => ({ ...prev, studentCode: event.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                        placeholder="2270xxxx"
                    />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Ho va ten
                    <input
                        value={form.studentName}
                        onChange={(event) => setForm((prev) => ({ ...prev, studentName: event.target.value }))}
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-sky-500"
                        placeholder="Nguyen Van A"
                    />
                </label>
                <button
                    type="submit"
                    className="mt-auto rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                    Luu
                </button>
            </form>
        </section>
    );
}
