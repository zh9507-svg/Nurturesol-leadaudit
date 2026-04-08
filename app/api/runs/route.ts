import { NextResponse } from "next/server";
import { z } from "zod";
import { createRun } from "@/lib/db/repository";

const createRunSchema = z.object({
  location: z.string().min(2),
  industry: z.string().min(2),
  businessCount: z.number().int().min(5).max(250),
  minimumRating: z.number().min(1).max(5).optional(),
  includeWithoutWebsites: z.boolean(),
  generateColdEmails: z.boolean(),
  exportReadyMode: z.boolean()
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = createRunSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Every run requires a valid location and industry, plus valid run settings.",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  const run = await createRun(parsed.data);
  return NextResponse.json({ id: run.id, status: run.status });
}
