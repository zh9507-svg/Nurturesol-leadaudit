import Link from "next/link";
import { GOOGLE_SHEETS_COLUMNS } from "@/lib/export/sheets";

export function ExportPanel({ runId }: { runId: string }) {
  return (
    <section className="panel">
      <div className="section-header">
        <p className="eyebrow">Export</p>
        <h2>CSV and Google Sheets-ready output</h2>
        <p className="muted">
          Column order is already normalized for direct spreadsheet use. Google Sheets integration can post the same data structure once credentials are configured.
        </p>
      </div>

      <div className="stack">
        <Link href={`/api/runs/${runId}/export`}>Download CSV</Link>
        <Link href={`/runs/${runId}/export`}>Open export preview</Link>
        <p>Columns: {GOOGLE_SHEETS_COLUMNS.join(", ")}</p>
      </div>
    </section>
  );
}
