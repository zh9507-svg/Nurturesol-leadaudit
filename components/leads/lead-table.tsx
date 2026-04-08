import Link from "next/link";
import type { LeadRecord } from "@/types";

export function LeadTable({ leads, runId }: { leads: LeadRecord[]; runId: string }) {
  return (
    <section className="panel">
      <div className="section-header">
        <p className="eyebrow">Leads Table</p>
        <h2>Sortable, filter-ready lead view</h2>
        <p className="muted">
          Filters to add next in production: no website, weak website, service needed, automation gap, SEO gap, ads readiness.
        </p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Business</th>
              <th>Website</th>
              <th>Primary service</th>
              <th>Overall score</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>{lead.business_name}</strong>
                  <span>
                    {lead.city}, {lead.state}
                  </span>
                </td>
                <td>{lead.website_present ? "Present" : "Missing"}</td>
                <td>{lead.service_recommendation?.primary_service_to_pitch ?? "Manual review"}</td>
                <td>{lead.scoring?.overall_opportunity_score ?? "-"}/10</td>
                <td>{lead.scoring?.lead_priority ?? "-"}</td>
                <td>
                  <Link href={`/runs/${runId}/leads/${lead.id}`}>Open lead</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
