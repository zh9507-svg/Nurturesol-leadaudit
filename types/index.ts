export type RunStatus =
  | "queued"
  | "discovering"
  | "auditing"
  | "scoring"
  | "completed"
  | "partial_failure"
  | "failed";

export type LeadPriority = "high" | "medium" | "low";

export type OpportunityBand = "High Opportunity" | "Medium Opportunity" | "Low Opportunity";

export interface ResearchRunInput {
  location: string;
  industry: string;
  businessCount: number;
  minimumRating?: number;
  includeWithoutWebsites: boolean;
  generateColdEmails: boolean;
  exportReadyMode: boolean;
}

export interface DiscoveryBusiness {
  business_name: string;
  category?: string;
  industry: string;
  sub_category?: string;
  google_maps_url?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  rating?: number;
  review_count?: number;
  hours?: Record<string, string>;
  social_links?: string[];
  multiple_locations?: boolean;
  active_status?: string;
  website_missing: boolean;
  location_targeted: string;
  discovery_source: string;
}

export interface AuditFact {
  category: string;
  detail: string;
}

export interface AuditInference {
  category: string;
  detail: string;
  confidence: "low" | "medium" | "high";
}

export interface AuditRecommendation {
  category: string;
  detail: string;
  impact: string;
}

export interface WebsiteAudit {
  observed_facts: AuditFact[];
  reasonable_inferences: AuditInference[];
  recommendations: AuditRecommendation[];
  website_design_notes: string;
  mobile_friendly_estimate: "strong" | "average" | "weak" | "needs manual review";
  cta_present: boolean;
  booking_flow_present: boolean;
  trust_elements_present: boolean;
  offer_clarity: "clear" | "mixed" | "weak";
  conversion_issues: string[];
  seo_notes: string;
  local_seo_opportunities: string[];
  ads_notes: string;
  automation_notes: string;
  website_quality_score: number;
  seo_opportunity_score: number;
  automation_opportunity_score: number;
  ads_readiness_score: number;
  manual_review_required: boolean;
}

export interface LeadScoreCard {
  website_quality_score: number;
  seo_opportunity_score: number;
  automation_opportunity_score: number;
  ads_readiness_score: number;
  overall_opportunity_score: number;
  opportunity_band: OpportunityBand;
  urgency_level: "high" | "medium" | "low";
  ease_of_closing_estimate: "high" | "medium" | "low";
  lead_priority: LeadPriority;
}

export interface ServiceRecommendation {
  primary_service_to_pitch: string;
  secondary_service_to_pitch: string;
  why_this_service: string;
  problem_it_solves: string;
  likely_business_impact: string;
}

export interface PitchPlan {
  personalized_opening_line: string;
  top_problem_found: string;
  missed_opportunity: string;
  primary_service_to_pitch: string;
  expected_impact: string;
  cta_angle: string;
  notes_for_sales_call: string;
}

export interface OutreachDraft {
  cold_email_subject: string;
  cold_email_body: string;
  followup_email_body: string;
}

export interface LeadRecord extends DiscoveryBusiness {
  id: string;
  website_present: boolean;
  audit?: WebsiteAudit;
  scoring?: LeadScoreCard;
  service_recommendation?: ServiceRecommendation;
  pitch_plan?: PitchPlan;
  outreach?: OutreachDraft;
  status_note?: string;
}

export interface RunLog {
  id: string;
  level: "info" | "warn" | "error";
  phase: "input" | "discovery" | "audit" | "scoring" | "export";
  message: string;
  created_at: string;
}

export interface ResearchRunRecord {
  id: string;
  status: RunStatus;
  location_targeted: string;
  industry_targeted: string;
  requested_business_count: number;
  minimum_rating?: number;
  include_without_websites: boolean;
  generate_cold_emails: boolean;
  export_ready_mode: boolean;
  businesses_discovered: number;
  businesses_audited: number;
  failures_count: number;
  retry_count: number;
  started_at: string;
  completed_at?: string;
  strategy_used: string;
  leads: LeadRecord[];
  logs: RunLog[];
}

export interface ExportRow {
  business_name: string;
  industry: string;
  sub_category: string;
  location_targeted: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  google_maps_url: string;
  rating: string;
  review_count: string;
  hours: string;
  social_links: string;
  multiple_locations: string;
  active_status: string;
  website_present: string;
  website_quality_score: string;
  website_design_notes: string;
  mobile_friendly_estimate: string;
  cta_present: string;
  booking_flow_present: string;
  trust_elements_present: string;
  offer_clarity: string;
  conversion_issues: string;
  seo_opportunity_score: string;
  seo_notes: string;
  local_seo_opportunities: string;
  ads_readiness_score: string;
  ads_notes: string;
  automation_opportunity_score: string;
  automation_notes: string;
  primary_service_to_pitch: string;
  secondary_service_to_pitch: string;
  why_this_service: string;
  top_problem_found: string;
  missed_opportunity: string;
  pitch_angle: string;
  expected_business_impact: string;
  urgency_level: string;
  ease_of_closing_estimate: string;
  overall_opportunity_score: string;
  lead_priority: string;
  personalized_opening_line: string;
  cold_email_subject: string;
  cold_email_body: string;
  followup_email_body: string;
  notes_for_sales_call: string;
}
