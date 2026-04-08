import { formatDateTime } from "@/lib/utils/format";
import type { ResearchRunRecord } from "@/types";

export function ProgressOverview({ run }: { run: ResearchRunRecord }) {
  const progress = run.requested_business_count
    ? Math.round((run.businesses_discovered / run.requested_business_count) * 100)
    : 0;

  return (
    <section className="panel">
      <div className="section-header">
        <p className="eyebrow">Research Progress</p>
        <h2>
          {run.location_targeted} + {run.industry_targeted}
        </h2>
        <p className="muted">
          Strategy: {run.strategy_used}. Started {formatDateTime(run.started_at)}.
        </p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span>Run status</span>
          <strong>{run.status}</strong>
        </div>
        <div className="metric-card">
          <span>Businesses found</span>
          <strong>{run.businesses_discovered}</strong>
        </div>
        <div className="metric-card">
          <span>Audited</span>
          <strong>{run.businesses_audited}</strong>
        </div>
        <div className="metric-card">
          <span>Failures / retries</span>
          <strong>
            {run.failures_count} / {run.retry_count}
          </strong>
        </div>
      </div>

      <div className="progress-shell" aria-label="Run progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="log-list">
        {run.logs.map((log) => (
          <div key={log.id} className="log-item">
            <span>{log.phase}</span>
            <p>{log.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
