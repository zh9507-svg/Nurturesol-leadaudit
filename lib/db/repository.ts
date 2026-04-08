import { buildDemoRun } from "@/lib/sample-data/demo-run";
import { SAMPLE_AUDIT_FINDINGS, SAMPLE_COLD_EMAIL_TEMPLATES, SAMPLE_PITCH_ANGLES, SAMPLE_SERVICE_RECOMMENDATIONS } from "@/lib/sample-data/templates";
import type { ResearchRunInput, ResearchRunRecord } from "@/types";

const runs = new Map<string, ResearchRunRecord>();

export async function createRun(input: ResearchRunInput) {
  const run = await buildDemoRun(input);
  runs.set(run.id, run);
  return run;
}

export async function getRun(runId: string) {
  return runs.get(runId) ?? null;
}

export function listTemplates() {
  return {
    coldEmailTemplates: SAMPLE_COLD_EMAIL_TEMPLATES,
    pitchAngles: SAMPLE_PITCH_ANGLES,
    auditFindings: SAMPLE_AUDIT_FINDINGS,
    serviceRecommendations: SAMPLE_SERVICE_RECOMMENDATIONS
  };
}
