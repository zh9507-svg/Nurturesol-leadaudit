import {
  SAMPLE_AUDIT_FINDINGS,
  SAMPLE_COLD_EMAIL_TEMPLATES,
  SAMPLE_PITCH_ANGLES
} from "@/lib/sample-data/templates";
import { orchestrateResearchRun } from "@/lib/research/run-orchestrator";
import type { LeadRecord, ResearchRunInput, ResearchRunRecord } from "@/types";

function buildOutreach(lead: LeadRecord) {
  const subject = `${lead.business_name}: quick booking growth idea`;
  const observation = lead.audit?.conversion_issues[0] ?? "the booking path could be clearer";

  return {
    cold_email_subject: subject,
    cold_email_body: `Hi ${lead.business_name},\n\nI was reviewing ${lead.industry.toLowerCase()} businesses in ${lead.location_targeted} and noticed ${observation.toLowerCase()}. That usually means some leads are dropping before they ever book.\n\nWe help salons and med spas tighten the website, booking flow, and follow-up automations so more inquiries turn into actual appointments.\n\nIf you want, I can send a short audit with the biggest gaps I found.\n\nBest,\nYour Name`,
    followup_email_body: `Hi ${lead.business_name},\n\nWanted to circle back on the quick audit offer. I still think there is an opportunity around ${observation.toLowerCase()} plus follow-up automation.\n\nHappy to send the notes over if helpful.\n\nBest,\nYour Name`
  };
}

export async function buildDemoRun(input: ResearchRunInput): Promise<ResearchRunRecord> {
  const run = await orchestrateResearchRun(input);

  const leads = run.leads.map((lead, index) => {
    const withPitchAngle: LeadRecord = {
      ...lead,
      pitch_plan: lead.pitch_plan
        ? {
            ...lead.pitch_plan,
            cta_angle: SAMPLE_PITCH_ANGLES[index % SAMPLE_PITCH_ANGLES.length]
          }
        : undefined
    };

    return {
      ...withPitchAngle,
      outreach: input.generateColdEmails ? buildOutreach(withPitchAngle) : undefined
    };
  });

  return {
    ...run,
    leads,
    logs: [
      ...run.logs,
      {
        id: "log-audit-summary",
        level: "info",
        phase: "audit",
        message: `Audited ${leads.filter((lead) => lead.audit).length} websites and flagged ${leads.filter((lead) => !lead.audit).length} leads for no-site or manual review handling.`,
        created_at: run.completed_at ?? run.started_at
      },
      {
        id: "log-export",
        level: "info",
        phase: "export",
        message: `Export package is ready with ${leads.length} rows. Starter templates loaded: ${SAMPLE_COLD_EMAIL_TEMPLATES.length}, example findings loaded: ${SAMPLE_AUDIT_FINDINGS.length}.`,
        created_at: run.completed_at ?? run.started_at
      }
    ]
  };
}
