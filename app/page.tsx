import Link from "next/link";
import { RunSetupForm } from "@/components/dashboard/run-setup-form";
import { listTemplates } from "@/lib/db/repository";

export default function HomePage() {
  const templates = listTemplates();

  return (
    <div className="page-grid">
      <section className="hero panel">
        <p className="eyebrow">Production-minded MVP</p>
        <h2>Research local businesses, audit growth gaps, recommend services, and generate outreach.</h2>
        <p className="muted">
          Designed for salons, med spas, aesthetic clinics, and similar local service businesses. Every new run must begin with
          a target location and target industry.
        </p>
      </section>

      <RunSetupForm />

      <section className="panel">
        <div className="section-header">
          <p className="eyebrow">What This MVP Includes</p>
          <h2>Architecture and deliverables baked into the app structure</h2>
        </div>
        <div className="card-grid">
          <article className="mini-card">
            <h3>Discovery pipeline</h3>
            <p>Primary API adapter plus fallback directory flow with duplicate removal and safe handling for missing data.</p>
          </article>
          <article className="mini-card">
            <h3>Website audit</h3>
            <p>Observed facts, inferences, recommendations, scorecards, service mapping, and sales-ready pitch outputs.</p>
          </article>
          <article className="mini-card">
            <h3>Exports</h3>
            <p>CSV and Google Sheets-ready column layout mapped to sales and audit use cases.</p>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="eyebrow">Built-in Sales Assets</p>
          <h2>Starter templates included in the MVP</h2>
        </div>
        <div className="stack">
          <p>{templates.coldEmailTemplates.length} cold email templates</p>
          <p>{templates.pitchAngles.length} pitch angles</p>
          <p>{templates.auditFindings.length} sample audit findings</p>
          <p>{templates.serviceRecommendations.length} sample service recommendations</p>
          <Link href="/api/templates">View template JSON</Link>
        </div>
      </section>
    </div>
  );
}
