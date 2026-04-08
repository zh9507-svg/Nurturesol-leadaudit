import { NextResponse } from "next/server";
import { getRun } from "@/lib/db/repository";

export async function GET(_: Request, { params }: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await params;
    const run = await getRun(runId);

    if (!run) {
      return NextResponse.json({ error: "Run not found." }, { status: 404 });
    }

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load run."
      },
      { status: 500 }
    );
  }
}
