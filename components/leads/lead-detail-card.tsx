import Link from "next/link";
import type { LeadRecord } from "@/types";

export function LeadDetailCard({ lead }: { lead: LeadRecord }) {
  return (
    <div className="detail-grid">
      <section className="panel">
        <div className="section-header">
          <p className="eyebrow">Business Info</p>
          <h2>{lead.business_name}</h2>
          <p className="muted">
            {lead.industry} {lead.sub_category ? `• ${lead.sub_category}` : ""}
          </p>
        </div>
        <div className="info-list">
          <p>Address: {lead.address ?? "N/A"}</p>
          <p>Phone: {lead.phone ?? "N/A"}</p>
          <p>Email: {lead.email ?? "N/A"}</p>
          <p>Website: {lead.website ? <Link href={lead.website}>{lead.website}</Link> : "Missing"}</p>
          <p>
            Google Maps: {lead.google_maps_url ? <Link href={lead.google_maps_url}>Open listing</Link> : "N/A"}
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="eyebrow">Audit Summary</p>
          <h2>Observed facts, inferences, and recommendations</h2>
        </div>
        <div className="stack">
          <div>
            <h3>Observed facts</h3>
            <ul>
              {(lead.audit?.observed_facts ?? []).map((item) => (
                <li key={item.detail}>{item.detail}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Reasonable inferences</h3>
            <ul>
              {(lead.audit?.reasonable_inferences ?? []).map((item) => (
                <li key={item.detail}>
                  {item.detail} ({item.confidence})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Recommendations</h3>
            <ul>
              {(lead.audit?.recommendations ?? []).map((item) => (
                <li key={item.detail}>
                  {item.detail} Impact: {item.impact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="eyebrow">Sales Plan</p>
          <h2>Service recommendation and outreach</h2>
        </div>
        <div className="stack">
          <p>Primary service: {lead.service_recommendation?.primary_service_to_pitch}</p>
          <p>Secondary service: {lead.service_recommendation?.secondary_service_to_pitch}</p>
          <p>Why: {lead.service_recommendation?.why_this_service}</p>
          <p>Top problem: {lead.pitch_plan?.top_problem_found}</p>
          <p>Missed opportunity: {lead.pitch_plan?.missed_opportunity}</p>
          <p>CTA angle: {lead.pitch_plan?.cta_angle}</p>
          <p>Cold email subject: {lead.outreach?.cold_email_subject}</p>
          <pre>{lead.outreach?.cold_email_body}</pre>
          <pre>{lead.outreach?.followup_email_body}</pre>
        </div>
      </section>
    </div>
  );
}
