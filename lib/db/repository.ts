import type { Prisma } from "@prisma/client";
import { buildDemoRun } from "@/lib/sample-data/demo-run";
import { SAMPLE_AUDIT_FINDINGS, SAMPLE_COLD_EMAIL_TEMPLATES, SAMPLE_PITCH_ANGLES, SAMPLE_SERVICE_RECOMMENDATIONS } from "@/lib/sample-data/templates";
import { getPrismaClient } from "@/lib/db/prisma";
import type { LeadRecord, ResearchRunInput, ResearchRunRecord, RunLog } from "@/types";

const runs = new Map<string, ResearchRunRecord>();

export async function createRun(input: ResearchRunInput) {
  const run = await buildDemoRun(input);
  const prisma = getPrismaClient();

  if (!prisma) {
    if (process.env.VERCEL) {
      throw new Error("DATABASE_URL is required on Vercel to persist research runs.");
    }

    runs.set(run.id, run);
    return run;
  }

  await prisma.researchRun.create({
    data: {
      id: run.id,
      locationTargeted: run.location_targeted,
      industryTargeted: run.industry_targeted,
      requestedBusinessCount: run.requested_business_count,
      minimumRating: run.minimum_rating,
      includeWithoutWebsites: run.include_without_websites,
      generateColdEmails: run.generate_cold_emails,
      exportReadyMode: run.export_ready_mode,
      status: run.status,
      businessesDiscovered: run.businesses_discovered,
      businessesAudited: run.businesses_audited,
      failuresCount: run.failures_count,
      retryCount: run.retry_count,
      strategyUsed: run.strategy_used,
      startedAt: new Date(run.started_at),
      completedAt: run.completed_at ? new Date(run.completed_at) : null,
      leads: {
        create: run.leads.map(serializeLeadForCreate)
      },
      logs: {
        create: run.logs.map(serializeLogForCreate)
      }
    }
  });

  return run;
}

export async function getRun(runId: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    if (process.env.VERCEL) {
      throw new Error("DATABASE_URL is required on Vercel to load persisted research runs.");
    }

    return runs.get(runId) ?? null;
  }

  const run = await prisma.researchRun.findUnique({
    where: { id: runId },
    include: {
      leads: {
        orderBy: {
          createdAt: "asc"
        }
      },
      logs: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  return run ? hydrateRun(run) : null;
}

export function listTemplates() {
  return {
    coldEmailTemplates: SAMPLE_COLD_EMAIL_TEMPLATES,
    pitchAngles: SAMPLE_PITCH_ANGLES,
    auditFindings: SAMPLE_AUDIT_FINDINGS,
    serviceRecommendations: SAMPLE_SERVICE_RECOMMENDATIONS
  };
}

function toJson(value: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

function serializeLeadForCreate(lead: LeadRecord) {
  return {
    id: lead.id,
    businessName: lead.business_name,
    category: lead.category,
    industry: lead.industry,
    subCategory: lead.sub_category,
    googleMapsUrl: lead.google_maps_url,
    website: lead.website || null,
    phone: lead.phone || null,
    email: lead.email || null,
    address: lead.address || null,
    city: lead.city || null,
    state: lead.state || null,
    postalCode: lead.postal_code || null,
    rating: lead.rating,
    reviewCount: lead.review_count,
    hours: toJson(lead.hours ?? null),
    socialLinks: toJson(lead.social_links ?? null),
    multipleLocations: Boolean(lead.multiple_locations),
    activeStatus: lead.active_status || null,
    websiteMissing: lead.website_missing,
    websitePresent: lead.website_present,
    audit: toJson(lead.audit ?? null),
    scoring: toJson(lead.scoring ?? null),
    serviceRecommendation: toJson(lead.service_recommendation ?? null),
    pitchPlan: toJson(lead.pitch_plan ?? null),
    outreach: toJson(lead.outreach ?? null),
    leadPriority: lead.scoring?.lead_priority ?? "medium",
    manualReviewRequired: Boolean(lead.audit?.manual_review_required)
  };
}

function serializeLogForCreate(log: RunLog) {
  return {
    id: log.id,
    level: log.level,
    phase: log.phase,
    message: log.message,
    createdAt: new Date(log.created_at)
  };
}

function hydrateRun(run: {
  id: string;
  status: ResearchRunRecord["status"];
  locationTargeted: string;
  industryTargeted: string;
  requestedBusinessCount: number;
  minimumRating: number | null;
  includeWithoutWebsites: boolean;
  generateColdEmails: boolean;
  exportReadyMode: boolean;
  businessesDiscovered: number;
  businessesAudited: number;
  failuresCount: number;
  retryCount: number;
  startedAt: Date | null;
  completedAt: Date | null;
  strategyUsed: string | null;
  leads: Array<{
    id: string;
    businessName: string;
    category: string | null;
    industry: string;
    subCategory: string | null;
    googleMapsUrl: string | null;
    website: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    rating: number | null;
    reviewCount: number | null;
    hours: Prisma.JsonValue | null;
    socialLinks: Prisma.JsonValue | null;
    multipleLocations: boolean;
    activeStatus: string | null;
    websiteMissing: boolean;
    websitePresent: boolean;
    audit: Prisma.JsonValue | null;
    scoring: Prisma.JsonValue | null;
    serviceRecommendation: Prisma.JsonValue | null;
    pitchPlan: Prisma.JsonValue | null;
    outreach: Prisma.JsonValue | null;
  }>;
  logs: Array<{
    id: string;
    level: string;
    phase: string;
    message: string;
    createdAt: Date;
  }>;
}): ResearchRunRecord {
  return {
    id: run.id,
    status: run.status,
    location_targeted: run.locationTargeted,
    industry_targeted: run.industryTargeted,
    requested_business_count: run.requestedBusinessCount,
    minimum_rating: run.minimumRating ?? undefined,
    include_without_websites: run.includeWithoutWebsites,
    generate_cold_emails: run.generateColdEmails,
    export_ready_mode: run.exportReadyMode,
    businesses_discovered: run.businessesDiscovered,
    businesses_audited: run.businessesAudited,
    failures_count: run.failuresCount,
    retry_count: run.retryCount,
    started_at: (run.startedAt ?? new Date()).toISOString(),
    completed_at: run.completedAt?.toISOString(),
    strategy_used: run.strategyUsed ?? "database",
    leads: run.leads.map((lead) => ({
      id: lead.id,
      business_name: lead.businessName,
      category: lead.category ?? undefined,
      industry: lead.industry,
      sub_category: lead.subCategory ?? undefined,
      google_maps_url: lead.googleMapsUrl ?? undefined,
      website: lead.website ?? undefined,
      phone: lead.phone ?? undefined,
      email: lead.email ?? undefined,
      address: lead.address ?? undefined,
      city: lead.city ?? undefined,
      state: lead.state ?? undefined,
      postal_code: lead.postalCode ?? undefined,
      rating: lead.rating ?? undefined,
      review_count: lead.reviewCount ?? undefined,
      hours: (lead.hours as LeadRecord["hours"]) ?? undefined,
      social_links: (lead.socialLinks as LeadRecord["social_links"]) ?? undefined,
      multiple_locations: lead.multipleLocations,
      active_status: lead.activeStatus ?? undefined,
      website_missing: lead.websiteMissing,
      location_targeted: run.locationTargeted,
      discovery_source: "persisted-run",
      website_present: lead.websitePresent,
      audit: (lead.audit as LeadRecord["audit"]) ?? undefined,
      scoring: (lead.scoring as LeadRecord["scoring"]) ?? undefined,
      service_recommendation: (lead.serviceRecommendation as LeadRecord["service_recommendation"]) ?? undefined,
      pitch_plan: (lead.pitchPlan as LeadRecord["pitch_plan"]) ?? undefined,
      outreach: (lead.outreach as LeadRecord["outreach"]) ?? undefined
    })),
    logs: run.logs.map((log) => ({
      id: log.id,
      level: log.level as RunLog["level"],
      phase: log.phase as RunLog["phase"],
      message: log.message,
      created_at: log.createdAt.toISOString()
    }))
  };
}
