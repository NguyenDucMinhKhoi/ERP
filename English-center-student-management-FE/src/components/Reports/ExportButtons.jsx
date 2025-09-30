import React from "react";
import { FileDown, FileSpreadsheet } from "lucide-react";
export default function ExportButtons({ activeTab }) {
  const canExport = true;

  const exportPdf = async () => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Export PDF:", activeTab);
  };
  const exportExcel = async () => {
    await new Promise((r) => setTimeout(r, 400));
    console.log("Export Excel:", activeTab);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={!canExport}
        onClick={exportPdf}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${
          canExport
            ? "bg-white hover:bg-slate-50"
            : "bg-slate-100 cursor-not-allowed"
        }`}
      >
        <FileDown className="h-4 w-4" /> PDF
      </button>
      <button
        disabled={!canExport}
        onClick={exportExcel}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border ${
          canExport
            ? "bg-white hover:bg-slate-50"
            : "bg-slate-100 cursor-not-allowed"
        }`}
      >
        <FileSpreadsheet className="h-4 w-4" /> Excel
      </button>
    </div>
  );
}
