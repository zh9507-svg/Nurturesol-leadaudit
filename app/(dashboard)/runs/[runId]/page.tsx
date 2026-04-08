import Link from "next/link";
import { notFound } from "next/navigation";
import { ExportPanel } from "@/components/dashboard/export-panel";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { LeadTable } from "@/components/leads/lead-table";
import { getRun } from "@/lib/db/repository";

export default async function RunDetailPage({
  params
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = await getRun(runId);

  if (!run) {
    notFound();
  }

  return (
    <div className="page-grid">
      <div className="breadcrumb">
        <Link href="/">New run</Link>
        <span>/</span>
        <span>{run.id}</span>
      </div>

      <ProgressOverview run={run} />
      <LeadTable leads={run.leads} runId={run.id} />
      <ExportPanel runId={run.id} />
    </div>
  );
}
