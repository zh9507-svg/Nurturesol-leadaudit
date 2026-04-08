import type { DiscoveryBusiness, PitchPlan, ServiceRecommendation, WebsiteAudit } from "@/types";

export const BUSINESS_SUMMARY_PROMPT = `
You are assisting with outbound lead generation for local businesses.
Summarize the business using ONLY the provided listing data and public website excerpts.

Rules:
- Do not invent facts.
- Separate observed facts from reasonable inferences.
- If information is missing, say it is missing.
- Keep the summary useful for a sales rep who wants to prioritize outreach.
`.trim();

export function buildWebsiteAuditPrompt(business: DiscoveryBusiness, visibleContent: string) {
  return `
You are auditing a local business website for sales opportunity.

Business listing data:
${JSON.stringify(business, null, 2)}

Publicly visible website content:
${visibleContent}

Return JSON with these top-level keys:
- observed_facts
- reasonable_inferences
- recommendations
- website_design_notes
- mobile_friendly_estimate
- cta_present
- booking_flow_present
- trust_elements_present
- offer_clarity
- conversion_issues
- seo_notes
- local_seo_opportunities
- ads_notes
- automation_notes
- website_quality_score
- seo_opportunity_score
- automation_opportunity_score
- ads_readiness_score
- manual_review_required

Rules:
- Facts must be directly supported by the page content or listing data.
- Inferences must be labeled as inferences and stay conservative.
- Recommendations must map to real business impact.
- Never claim access to hidden analytics, CRM data, ad account data, or backend systems.
- If the site is blocked or thin, set manual_review_required to true.
`.trim();
}

export function buildServiceRecommendationPrompt(business: DiscoveryBusiness, audit?: WebsiteAudit) {
  return `
You are selecting the best service to pitch to a local business.

Available services:
- Paid Ads
- Website Redesign
- Local SEO
- GoHighLevel Setup
- CRM Automation
- Lead Nurturing
- No-Show Recovery
- Review Generation
- Reactivation Campaigns
- Booking Funnel Optimization
- Missed-Call Text Back

Business data:
${JSON.stringify(business, null, 2)}

Audit data:
${JSON.stringify(audit ?? {}, null, 2)}

Return JSON with:
- primary_service_to_pitch
- secondary_service_to_pitch
- why_this_service
- problem_it_solves
- likely_business_impact

Ground the answer only in the supplied listing data and visible website evidence.
`.trim();
}

export function buildPitchPlanPrompt(
  business: DiscoveryBusiness,
  audit: WebsiteAudit | undefined,
  recommendation: ServiceRecommendation
) {
  return `
Create a short practical pitch plan for sales outreach.

Business:
${JSON.stringify(business, null, 2)}

Audit:
${JSON.stringify(audit ?? {}, null, 2)}

Recommendation:
${JSON.stringify(recommendation, null, 2)}

Return JSON with:
- personalized_opening_line
- top_problem_found
- missed_opportunity
- primary_service_to_pitch
- expected_impact
- cta_angle
- notes_for_sales_call

Rules:
- Mention one real observation when available.
- No fake promises or fabricated numbers.
- Keep it useful for an actual sales call.
`.trim();
}

export function buildColdEmailPrompt(
  business: DiscoveryBusiness,
  audit: WebsiteAudit | undefined,
  recommendation: ServiceRecommendation,
  pitchPlan: PitchPlan
) {
  return `
Write cold outreach for a local business.

Business:
${JSON.stringify(business, null, 2)}

Audit:
${JSON.stringify(audit ?? {}, null, 2)}

Recommendation:
${JSON.stringify(recommendation, null, 2)}

Pitch plan:
${JSON.stringify(pitchPlan, null, 2)}

Return JSON with:
- cold_email_subject
- cold_email_body
- followup_email_body

Rules:
- concise
- human
- personalized
- mention one real observation if available
- no fake guarantees
- no spammy tone
- simple CTA
`.trim();
}
