import type { DiscoveryBusiness, WebsiteAudit } from "@/types";

function scoreFromPresence<T>(value: T | null | undefined, whenTrue: number, whenFalse: number) {
  return value ? whenTrue : whenFalse;
}

export async function auditWebsite(business: DiscoveryBusiness): Promise<WebsiteAudit | undefined> {
  if (!business.website) {
    return undefined;
  }

  const bookingPresent = business.industry.toLowerCase().includes("spa") || business.industry.toLowerCase().includes("salon");
  const trustPresent = (business.review_count ?? 0) > 25;

  const website_quality_score =
    scoreFromPresence(bookingPresent, 7, 5) +
    scoreFromPresence(trustPresent, 1, -1) +
    scoreFromPresence(business.email, 1, 0);

  const seo_opportunity_score = business.sub_category?.toLowerCase().includes("clinic") ? 8 : 7;
  const automation_opportunity_score = business.multiple_locations ? 9 : 8;
  const ads_readiness_score = business.website_missing ? 2 : bookingPresent ? 7 : 5;

  return {
    observed_facts: [
      { category: "website", detail: `A public website is listed for ${business.business_name}.` },
      { category: "contact", detail: business.phone ? "A phone number is publicly listed." : "No phone number was captured." },
      {
        category: "reputation",
        detail:
          business.rating && business.review_count
            ? `The listing shows a ${business.rating} rating across ${business.review_count} reviews.`
            : "Rating or review count is incomplete."
      }
    ],
    reasonable_inferences: [
      {
        category: "conversion",
        detail: bookingPresent
          ? "The business likely depends on consultation or appointment conversion paths."
          : "The business likely needs a stronger service-to-lead conversion path.",
        confidence: "medium"
      },
      {
        category: "automation",
        detail: "Lead follow-up automation is likely underdeveloped unless a dedicated CRM flow is visible.",
        confidence: "medium"
      }
    ],
    recommendations: [
      {
        category: "website",
        detail: "Tighten the primary CTA and booking path above the fold.",
        impact: "Reduces friction for paid and organic traffic."
      },
      {
        category: "automation",
        detail: "Implement instant response and missed-call follow-up flows.",
        impact: "Protects inbound lead value and improves show rates."
      }
    ],
    website_design_notes:
      "Use this initial audit as a triage layer. Production mode should enrich this with Playwright screenshots, DOM extraction, mobile viewport checks, and technical issue capture.",
    mobile_friendly_estimate: "average",
    cta_present: true,
    booking_flow_present: bookingPresent,
    trust_elements_present: trustPresent,
    offer_clarity: bookingPresent ? "mixed" : "weak",
    conversion_issues: [
      bookingPresent
        ? "The site likely needs a more direct booking CTA path from the hero section."
        : "Traffic may not have a strong next step to convert."
    ],
    seo_notes:
      "Prioritize title, H1, service-page depth, and location relevance. Add pages for core treatments and target neighborhoods when missing.",
    local_seo_opportunities: [
      "Create service-plus-location landing pages for the highest-value treatments.",
      "Strengthen internal links between service pages, reviews, and contact pages."
    ],
    ads_notes:
      "Meta and Google Ads can work if the offer, landing page clarity, and booking path are tightened before scaling traffic.",
    automation_notes:
      "Recommended automations: lead response, no-show recovery, consultation reminders, review requests, and win-back campaigns.",
    website_quality_score,
    seo_opportunity_score,
    automation_opportunity_score,
    ads_readiness_score,
    manual_review_required: false
  };
}
