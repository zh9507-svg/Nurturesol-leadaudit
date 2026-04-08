import { auditWebsite } from "@/lib/research/site-audit";
import { discoverBusinesses } from "@/lib/research/discovery";
import { buildPitchPlan, recommendServices, scoreLead } from "@/lib/scoring/lead-scoring";
import type { LeadRecord, ResearchRunInput, ResearchRunRecord } from "@/types";

export async function orchestrateResearchRun(input: ResearchRunInput): Promise<ResearchRunRecord> {
  const startedAt = new Date().toISOString();
  const { businesses, strategy_used } = await discoverBusinesses(input);

  const leads: LeadRecord[] = [];
  const logs: ResearchRunRecord["logs"] = [
    {
      id: "log-input",
      level: "info",
      phase: "input",
      message: `Run initialized for ${input.location} + ${input.industry}.`,
      created_at: startedAt
    }
  ];

  for (const business of businesses) {
    try {
      const audit = await auditWebsite(business);
      const scoring = scoreLead(business, audit);
      const serviceRecommendation = recommendServices(business, audit);
      const pitchPlan = buildPitchPlan(business, audit, serviceRecommendation);

      leads.push({
        id: `${business.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        ...business,
        website_present: Boolean(business.website),
        audit,
        scoring,
        service_recommendation: serviceRecommendation,
        pitch_plan: pitchPlan,
        status_note: business.website_missing ? "Website missing, retained for manual outreach." : "Automated audit completed."
      });
    } catch (error) {
      logs.push({
        id: `log-error-${logs.length + 1}`,
        level: "error",
        phase: "audit",
        message: `Audit failed for ${business.business_name}. Marked for manual review.`,
        created_at: new Date().toISOString()
      });

      leads.push({
        id: `${business.business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        ...business,
        website_present: Boolean(business.website),
        scoring: scoreLead(business),
        service_recommendation: recommendServices(business),
        pitch_plan: buildPitchPlan(business, undefined, recommendServices(business)),
        status_note: error instanceof Error ? error.message : "Unknown audit failure."
      });
    }
  }

  const completedAt = new Date().toISOString();

  logs.push({
    id: "log-discovery",
    level: "info",
    phase: "discovery",
    message: `Discovery completed with ${leads.length} retained businesses using ${strategy_used}.`,
    created_at: completedAt
  });

  return {
    id: `run-${Date.now()}`,
    status: "completed",
    location_targeted: input.location,
    industry_targeted: input.industry,
    requested_business_count: input.businessCount,
    minimum_rating: input.minimumRating,
    include_without_websites: input.includeWithoutWebsites,
    generate_cold_emails: input.generateColdEmails,
    export_ready_mode: input.exportReadyMode,
    businesses_discovered: leads.length,
    businesses_audited: leads.filter((lead) => lead.audit).length,
    failures_count: logs.filter((log) => log.level === "error").length,
    retry_count: 0,
    started_at: startedAt,
    completed_at: completedAt,
    strategy_used,
    leads,
    logs
  };
}
