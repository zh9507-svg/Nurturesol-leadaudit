import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadDetailCard } from "@/components/leads/lead-detail-card";
import { getRun } from "@/lib/db/repository";

export default async function LeadDetailPage({
  params
}: {
  params: Promise<{ runId: string; leadId: string }>;
}) {
  const { runId, leadId } = await params;
  const run = await getRun(runId);

  if (!run) {
    notFound();
  }

  const lead = run.leads.find((item) => item.id === leadId);

  if (!lead) {
    notFound();
  }

  return (
    <div className="page-grid">
      <div className="breadcrumb">
        <Link href={`/runs/${runId}`}>Back to run</Link>
        <span>/</span>
        <span>{lead.business_name}</span>
      </div>
      <LeadDetailCard lead={lead} />
    </div>
  );
}
