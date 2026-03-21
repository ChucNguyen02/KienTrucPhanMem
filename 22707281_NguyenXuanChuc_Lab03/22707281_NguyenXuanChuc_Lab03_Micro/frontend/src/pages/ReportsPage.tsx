import { Download } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { exportLeaderboardToExcel, exportLeaderboardToPdf } from '../utils/reportExport';

export function ReportsPage() {
    const { leaderboard, campaignSummary, isLoading, error } = useLeaderboard();

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Points & Reporting</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Tong hop diem ren luyen tu du lieu diem danh va diem chien dich.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => exportLeaderboardToExcel(leaderboard)}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                        >
                            <Download size={16} /> Export Excel
                        </button>
                        <button
                            onClick={() => exportLeaderboardToPdf(leaderboard)}
                            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
                        >
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>
                {isLoading ? <p className="mt-3 text-sm text-slate-500">Dang tai bao cao...</p> : null}
                {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Leaderboard sinh vien</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="px-3 py-2">#</th>
                                <th className="px-3 py-2">Sinh vien</th>
                                <th className="px-3 py-2">So lan tham gia</th>
                                <th className="px-3 py-2">Tong diem</th>
                                <th className="px-3 py-2">Chien dich</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaderboard.map((item, index) => (
                                <tr key={item.studentCode}>
                                    <td className="px-3 py-3 font-semibold text-slate-700">{index + 1}</td>
                                    <td className="px-3 py-3">
                                        <p className="font-semibold text-slate-900">{item.studentName}</p>
                                        <p className="text-slate-600">{item.studentCode}</p>
                                    </td>
                                    <td className="px-3 py-3 text-slate-700">{item.attendanceCount}</td>
                                    <td className="px-3 py-3 text-slate-700">{item.totalPoints}</td>
                                    <td className="px-3 py-3 text-slate-600">{item.campaigns.join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Tong hop theo chien dich</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead>
                            <tr className="text-left text-slate-500">
                                <th className="px-3 py-2">Campaign</th>
                                <th className="px-3 py-2">So nguoi tham gia</th>
                                <th className="px-3 py-2">Tong lan diem danh</th>
                                <th className="px-3 py-2">Tong diem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaignSummary.map((item) => (
                                <tr key={item.campaignId}>
                                    <td className="px-3 py-3">
                                        <p className="font-semibold text-slate-900">{item.campaignCode}</p>
                                        <p className="text-slate-600">{item.campaignName}</p>
                                    </td>
                                    <td className="px-3 py-3 text-slate-700">{item.participants}</td>
                                    <td className="px-3 py-3 text-slate-700">{item.totalAttendance}</td>
                                    <td className="px-3 py-3 text-slate-700">{item.totalPoints}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
