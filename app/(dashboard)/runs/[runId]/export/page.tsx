import { notFound } from "next/navigation";
import { GOOGLE_SHEETS_COLUMNS, buildExportRows } from "@/lib/export/sheets";
import { getRun } from "@/lib/db/repository";

export default async function ExportPreviewPage({
  params
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = await getRun(runId);

  if (!run) {
    notFound();
  }

  const rows = buildExportRows(run);

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="section-header">
          <p className="eyebrow">Export Preview</p>
          <h2>Google Sheets-ready rows</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {GOOGLE_SHEETS_COLUMNS.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.business_name}-${index}`}>
                  {GOOGLE_SHEETS_COLUMNS.map((column) => (
                    <td key={column}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
