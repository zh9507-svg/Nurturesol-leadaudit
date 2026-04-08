import { NextResponse } from "next/server";
import { getRun } from "@/lib/db/repository";
import { buildCsv } from "@/lib/export/sheets";

export async function GET(_: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = await getRun(runId);

  if (!run) {
    return NextResponse.json({ error: "Run not found." }, { status: 404 });
  }

  const csv = buildCsv(run);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${run.location_targeted}-${run.industry_targeted}-lead-export.csv"`
    }
  });
}
