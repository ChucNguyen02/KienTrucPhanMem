import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = <T extends Record<string, unknown>>(
    rows: T[],
    fileName: string,
) => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPdf = (
    title: string,
    headers: string[],
    body: Array<Array<string | number>>,
    fileName: string,
) => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text(title, 14, 16);

    autoTable(doc, {
        startY: 24,
        head: [headers],
        body,
        styles: {
            fontSize: 10,
            cellPadding: 2,
        },
    });

    doc.save(`${fileName}.pdf`);
};
