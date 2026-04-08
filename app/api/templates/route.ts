import { NextResponse } from "next/server";
import { listTemplates } from "@/lib/db/repository";

export async function GET() {
  return NextResponse.json(listTemplates());
}
