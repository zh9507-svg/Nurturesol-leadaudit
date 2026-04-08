import type { ExportRow, LeadRecord, ResearchRunRecord } from "@/types";

export const GOOGLE_SHEETS_COLUMNS: Array<keyof ExportRow> = [
  "business_name",
  "industry",
  "sub_category",
  "location_targeted",
  "address",
  "city",
  "state",
  "postal_code",
  "phone",
  "email",
  "website",
  "google_maps_url",
  "rating",
  "review_count",
  "hours",
  "social_links",
  "multiple_locations",
  "active_status",
  "website_present",
  "website_quality_score",
  "website_design_notes",
  "mobile_friendly_estimate",
  "cta_present",
  "booking_flow_present",
  "trust_elements_present",
  "offer_clarity",
  "conversion_issues",
  "seo_opportunity_score",
  "seo_notes",
  "local_seo_opportunities",
  "ads_readiness_score",
  "ads_notes",
  "automation_opportunity_score",
  "automation_notes",
  "primary_service_to_pitch",
  "secondary_service_to_pitch",
  "why_this_service",
  "top_problem_found",
  "missed_opportunity",
  "pitch_angle",
  "expected_business_impact",
  "urgency_level",
  "ease_of_closing_estimate",
  "overall_opportunity_score",
  "lead_priority",
  "personalized_opening_line",
  "cold_email_subject",
  "cold_email_body",
  "followup_email_body",
  "notes_for_sales_call"
];

function serializeLead(lead: LeadRecord): ExportRow {
  return {
    business_name: lead.business_name,
    industry: lead.industry,
    sub_category: lead.sub_category ?? "",
    location_targeted: lead.location_targeted,
    address: lead.address ?? "",
    city: lead.city ?? "",
    state: lead.state ?? "",
    postal_code: lead.postal_code ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    website: lead.website ?? "",
    google_maps_url: lead.google_maps_url ?? "",
    rating: lead.rating?.toString() ?? "",
    review_count: lead.review_count?.toString() ?? "",
    hours: JSON.stringify(lead.hours ?? {}),
    social_links: (lead.social_links ?? []).join(", "),
    multiple_locations: String(Boolean(lead.multiple_locations)),
    active_status: lead.active_status ?? "",
    website_present: String(Boolean(lead.website_present)),
    website_quality_score: lead.audit?.website_quality_score?.toString() ?? "",
    website_design_notes: lead.audit?.website_design_notes ?? "",
    mobile_friendly_estimate: lead.audit?.mobile_friendly_estimate ?? "",
    cta_present: String(Boolean(lead.audit?.cta_present)),
    booking_flow_present: String(Boolean(lead.audit?.booking_flow_present)),
    trust_elements_present: String(Boolean(lead.audit?.trust_elements_present)),
    offer_clarity: lead.audit?.offer_clarity ?? "",
    conversion_issues: (lead.audit?.conversion_issues ?? []).join(" | "),
    seo_opportunity_score: lead.audit?.seo_opportunity_score?.toString() ?? "",
    seo_notes: lead.audit?.seo_notes ?? "",
    local_seo_opportunities: (lead.audit?.local_seo_opportunities ?? []).join(" | "),
    ads_readiness_score: lead.audit?.ads_readiness_score?.toString() ?? "",
    ads_notes: lead.audit?.ads_notes ?? "",
    automation_opportunity_score: lead.audit?.automation_opportunity_score?.toString() ?? "",
    automation_notes: lead.audit?.automation_notes ?? "",
    primary_service_to_pitch: lead.service_recommendation?.primary_service_to_pitch ?? "",
    secondary_service_to_pitch: lead.service_recommendation?.secondary_service_to_pitch ?? "",
    why_this_service: lead.service_recommendation?.why_this_service ?? "",
    top_problem_found: lead.pitch_plan?.top_problem_found ?? "",
    missed_opportunity: lead.pitch_plan?.missed_opportunity ?? "",
    pitch_angle: lead.pitch_plan?.cta_angle ?? "",
    expected_business_impact: lead.pitch_plan?.expected_impact ?? "",
    urgency_level: lead.scoring?.urgency_level ?? "",
    ease_of_closing_estimate: lead.scoring?.ease_of_closing_estimate ?? "",
    overall_opportunity_score: lead.scoring?.overall_opportunity_score?.toString() ?? "",
    lead_priority: lead.scoring?.lead_priority ?? "",
    personalized_opening_line: lead.pitch_plan?.personalized_opening_line ?? "",
    cold_email_subject: lead.outreach?.cold_email_subject ?? "",
    cold_email_body: lead.outreach?.cold_email_body ?? "",
    followup_email_body: lead.outreach?.followup_email_body ?? "",
    notes_for_sales_call: lead.pitch_plan?.notes_for_sales_call ?? ""
  };
}

export function buildExportRows(run: ResearchRunRecord) {
  return run.leads.map(serializeLead);
}

export function buildGoogleSheetsPayload(run: ResearchRunRecord) {
  return {
    columns: GOOGLE_SHEETS_COLUMNS,
    rows: buildExportRows(run).map((row) => GOOGLE_SHEETS_COLUMNS.map((column) => row[column]))
  };
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildCsv(run: ResearchRunRecord) {
  const rows = buildExportRows(run);
  const header = GOOGLE_SHEETS_COLUMNS.join(",");
  const body = rows
    .map((row) => GOOGLE_SHEETS_COLUMNS.map((column) => escapeCsv(String(row[column] ?? ""))).join(","))
    .join("\n");

  return `${header}\n${body}`;
}
