import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { LeaderboardItem } from '../types/report';

export function exportLeaderboardToExcel(data: LeaderboardItem[]): void {
    const rows = data.map((item, index) => ({
        STT: index + 1,
        MSSV: item.studentCode,
        HoTen: item.studentName,
        SoLanThamGia: item.attendanceCount,
        TongDiem: item.totalPoints,
        ChienDich: item.campaigns.join(', '),
    }));

    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Leaderboard');
    writeFile(workbook, 'leaderboard.xlsx');
}

export function exportLeaderboardToPdf(data: LeaderboardItem[]): void {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Bao cao diem ren luyen', 14, 18);

    autoTable(doc, {
        startY: 24,
        head: [['#', 'MSSV', 'Ho ten', 'So lan', 'Tong diem']],
        body: data.map((item, index) => [
            String(index + 1),
            item.studentCode,
            item.studentName,
            String(item.attendanceCount),
            String(item.totalPoints),
        ]),
        styles: { fontSize: 10 },
    });

    doc.save('leaderboard.pdf');
}
