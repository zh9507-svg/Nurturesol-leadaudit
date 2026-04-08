import type {
  DiscoveryBusiness,
  LeadScoreCard,
  PitchPlan,
  ServiceRecommendation,
  WebsiteAudit
} from "@/types";

function clampScore(value: number) {
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function scoreLead(business: DiscoveryBusiness, audit?: WebsiteAudit): LeadScoreCard {
  const baseWebsite = audit?.website_quality_score ?? (business.website_missing ? 2 : 5);
  const seo = audit?.seo_opportunity_score ?? (business.website_missing ? 9 : 6);
  const automation = audit?.automation_opportunity_score ?? 7;
  const ads = audit?.ads_readiness_score ?? (business.website_missing ? 2 : 5);

  const overallOpportunity = clampScore(
    0.2 * (11 - baseWebsite) + 0.25 * seo + 0.25 * automation + 0.3 * (11 - ads)
  );

  const opportunity_band =
    overallOpportunity >= 8 ? "High Opportunity" : overallOpportunity >= 5 ? "Medium Opportunity" : "Low Opportunity";

  const urgency_level =
    business.website_missing || audit?.manual_review_required
      ? "high"
      : overallOpportunity >= 8
        ? "high"
        : overallOpportunity >= 5
          ? "medium"
          : "low";

  const ease_of_closing_estimate =
    business.rating && business.rating >= 4.4 && (business.review_count ?? 0) > 20
      ? "high"
      : business.rating && business.rating >= 4.0
        ? "medium"
        : "low";

  const lead_priority =
    opportunity_band === "High Opportunity" && ease_of_closing_estimate !== "low"
      ? "high"
      : opportunity_band === "Medium Opportunity"
        ? "medium"
        : "low";

  return {
    website_quality_score: clampScore(baseWebsite),
    seo_opportunity_score: clampScore(seo),
    automation_opportunity_score: clampScore(automation),
    ads_readiness_score: clampScore(ads),
    overall_opportunity_score: overallOpportunity,
    opportunity_band,
    urgency_level,
    ease_of_closing_estimate,
    lead_priority
  };
}

export function recommendServices(
  business: DiscoveryBusiness,
  audit?: WebsiteAudit
): ServiceRecommendation {
  const websiteWeak = !business.website || (audit?.website_quality_score ?? 10) <= 5;
  const seoGap = (audit?.seo_opportunity_score ?? 0) >= 7;
  const automationGap = (audit?.automation_opportunity_score ?? 0) >= 7;
  const adsWeak = (audit?.ads_readiness_score ?? 10) <= 5;

  if (websiteWeak) {
    return {
      primary_service_to_pitch: "Website Redesign",
      secondary_service_to_pitch: adsWeak ? "Booking Funnel Optimization" : "Local SEO",
      why_this_service:
        "The website is either missing or underperforming, which hurts trust, conversions, and paid traffic efficiency.",
      problem_it_solves: "Fixes unclear messaging, weak CTAs, and poor booking flow so leads do not leak out.",
      likely_business_impact: "More booked consultations, stronger first impressions, and higher ROI from future ads."
    };
  }

  if (automationGap) {
    return {
      primary_service_to_pitch: "CRM Automation",
      secondary_service_to_pitch: "Missed-Call Text Back",
      why_this_service:
        "The business likely has follow-up gaps after form fills, calls, or consultation requests.",
      problem_it_solves: "Improves lead response time, reminder flows, nurture, and reactivation without manual chasing.",
      likely_business_impact: "More consultations shown, fewer no-shows, and better recovery of missed leads."
    };
  }

  if (seoGap) {
    return {
      primary_service_to_pitch: "Local SEO",
      secondary_service_to_pitch: "Review Generation",
      why_this_service:
        "There are visible local search gaps around service pages, location targeting, or trust-building content.",
      problem_it_solves: "Improves map visibility, location relevance, and organic lead capture.",
      likely_business_impact: "More non-paid discovery from high-intent local searchers."
    };
  }

  return {
    primary_service_to_pitch: "Paid Ads",
    secondary_service_to_pitch: "Lead Nurturing",
    why_this_service: "The business appears credible enough to benefit from stronger demand generation and better follow-up.",
    problem_it_solves: "Creates a reliable lead source while ensuring prospects are not lost after the click.",
    likely_business_impact: "More booked consultations and faster pipeline growth."
  };
}

export function buildPitchPlan(
  business: DiscoveryBusiness,
  audit: WebsiteAudit | undefined,
  recommendation: ServiceRecommendation
): PitchPlan {
  const topProblem =
    audit?.conversion_issues[0] ??
    (business.website_missing ? "There is no visible website experience to capture and convert new demand." : "The conversion path looks weak.");

  return {
    personalized_opening_line: `I took a quick look at ${business.business_name} and noticed a few ways you could capture more bookings from local traffic.`,
    top_problem_found: topProblem,
    missed_opportunity:
      audit?.local_seo_opportunities[0] ??
      "Prospects are likely falling off before they book because the offer and next step are not strong enough.",
    primary_service_to_pitch: recommendation.primary_service_to_pitch,
    expected_impact: recommendation.likely_business_impact,
    cta_angle: "Offer a short audit walkthrough focused on missed bookings, lead response speed, and conversion gaps.",
    notes_for_sales_call:
      "Lead with one observed issue, quantify the likely leakage in the funnel, then anchor the pitch to booking growth rather than generic marketing."
  };
}
