import { NextResponse } from "next/server";
import { z } from "zod";
import { buildDemoRun } from "@/lib/sample-data/demo-run";
import { buildCsv } from "@/lib/export/sheets";

const exportSchema = z.object({
  location: z.string().min(2),
  industry: z.string().min(2),
  businessCount: z.number().int().min(5).max(250),
  minimumRating: z.number().min(1).max(5).optional(),
  includeWithoutWebsites: z.boolean(),
  generateColdEmails: z.boolean(),
  exportReadyMode: z.boolean()
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = exportSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "A valid location, industry, and export configuration are required.",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const run = await buildDemoRun(parsed.data);
    const csv = buildCsv(run);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${run.location_targeted}-${run.industry_targeted}-lead-export.csv"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to build CSV export."
      },
      { status: 500 }
    );
  }
}
