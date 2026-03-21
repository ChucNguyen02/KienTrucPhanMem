import { useEffect, useState } from "react";
import { PageTitle, Panel } from "../components/common";
import { normalizeError, pointService, reportService } from "../services";
import type { AttendanceReportItem, CampaignReportItem, LeaderboardItem, PointTransaction } from "../types";
import { exportToExcel, exportToPdf } from "../utils/exporter";

export const PointsReportingPage = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
    const [attendanceReport, setAttendanceReport] = useState<AttendanceReportItem[]>([]);
    const [campaignReport, setCampaignReport] = useState<CampaignReportItem[]>([]);
    const [studentCode, setStudentCode] = useState("22707281");
    const [balance, setBalance] = useState<number | null>(null);
    const [history, setHistory] = useState<PointTransaction[]>([]);
    const [error, setError] = useState("");

    const loadReports = async () => {
        setError("");
        try {
            const [board, attendance, campaigns] = await Promise.all([
                pointService.getLeaderboard(20),
                reportService.getAttendance(),
                reportService.getCampaigns(),
            ]);
            setLeaderboard(board);
            setAttendanceReport(attendance);
            setCampaignReport(campaigns);
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            void loadReports();
        });
    }, []);

    const findStudent = async () => {
        setError("");
        try {
            const [pointBalance, pointHistory] = await Promise.all([
                pointService.getBalance(studentCode.trim()),
                pointService.getHistory(studentCode.trim()),
            ]);
            setBalance(pointBalance.balance);
            setHistory(pointHistory);
        } catch (e) {
            setError(normalizeError(e));
        }
    };

    const exportLeaderboardExcel = () => {
        exportToExcel(
            leaderboard.map((item, index) => ({ Rank: index + 1, StudentCode: item.studentCode, Balance: item.balance })),
            "leaderboard",
        );
    };

    const exportAttendancePdf = () => {
        exportToPdf(
            "Attendance Report",
            ["Event", "Total Registered", "Total Checked In"],
            attendanceReport.map((item) => [item.eventTitle, item.totalRegistered, item.totalCheckedIn]),
            "attendance-report",
        );
    };

    return (
        <div className="space-y-6">
            <PageTitle
                title="Plugin 3: Points & Reporting"
                subtitle="Tong hop diem theo diem danh tham gia, hien thi leaderboard va xuat bao cao Excel/PDF cho admin."
            />

            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <div className="grid gap-6 lg:grid-cols-2">
                <Panel>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-slate-900">Leaderboard</h2>
                        <button
                            type="button"
                            onClick={exportLeaderboardExcel}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
                        >
                            Export Excel
                        </button>
                    </div>
                    <ol className="space-y-2">
                        {leaderboard.map((item, index) => (
                            <li key={item.studentCode} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                                <span className="font-medium text-slate-700">#{index + 1} - {item.studentCode}</span>
                                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">{item.balance} diem</span>
                            </li>
                        ))}
                    </ol>
                </Panel>

                <Panel>
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Tra cuu diem ca nhan</h2>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
                            value={studentCode}
                            onChange={(e) => setStudentCode(e.target.value)}
                            placeholder="Nhap ma sinh vien"
                        />
                        <button type="button" onClick={() => void findStudent()} className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">
                            Tra cuu
                        </button>
                    </div>
                    {balance !== null && <p className="mt-4 text-sm font-semibold text-slate-700">Tong diem: {balance}</p>}
                    <div className="mt-3 space-y-2">
                        {history.map((item) => (
                            <div key={item.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                <p className="font-semibold text-slate-900">{item.type} {item.points} diem</p>
                                <p className="text-xs text-slate-500">Source: {item.source}</p>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Panel>
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-slate-900">Attendance Report</h2>
                        <button
                            type="button"
                            onClick={exportAttendancePdf}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold"
                        >
                            Export PDF
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-3 py-2">Event</th>
                                    <th className="px-3 py-2">Registered</th>
                                    <th className="px-3 py-2">Checked In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceReport.map((item) => (
                                    <tr key={item.eventId} className="border-b border-slate-100">
                                        <td className="px-3 py-2">{item.eventTitle}</td>
                                        <td className="px-3 py-2">{item.totalRegistered}</td>
                                        <td className="px-3 py-2">{item.totalCheckedIn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>

                <Panel>
                    <h2 className="mb-4 text-lg font-bold text-slate-900">Campaign Report</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-3 py-2">Campaign</th>
                                    <th className="px-3 py-2">Events</th>
                                    <th className="px-3 py-2">Registrations</th>
                                    <th className="px-3 py-2">Checked In</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaignReport.map((item) => (
                                    <tr key={item.campaignId} className="border-b border-slate-100">
                                        <td className="px-3 py-2">{item.campaignName}</td>
                                        <td className="px-3 py-2">{item.totalEvents}</td>
                                        <td className="px-3 py-2">{item.totalRegistrations}</td>
                                        <td className="px-3 py-2">{item.totalCheckedIn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            </div>
        </div>
    );
};
