# Lead Audit OS MVP

Production-minded web app for outbound lead generation, local business research, website audits, service recommendations, personalized outreach, and spreadsheet exports.

## Core rule

Every new research run must begin with:

1. `Which location?`
2. `Which industry?`

This is enforced in both the UI and the `POST /api/runs` validator.

## MVP architecture

- Frontend: Next.js App Router, TypeScript, React 19
- Backend: Next.js route handlers for run creation, run retrieval, exports, and template assets
- Research engine: hybrid discovery pipeline with primary provider adapter and fallback directory adapter
- Website audit engine: Playwright-ready audit layer with fact and inference separation
- AI layer: internal prompt library grounded in public listing and website data only
- Database: PostgreSQL via Prisma schema
- Export layer: CSV and Google Sheets-ready normalized row builder
- Sales outputs: scoring, service recommendation, pitch plans, cold email drafts

## Production-minded pipeline

### 1. Input and run creation

- Required fields: `location`, `industry`
- Optional controls: business count, minimum rating, include no-website businesses, cold email generation, export-ready mode
- Validation happens server-side before a run record is created

### 2. Lead discovery

- First choice: Google Places API or compliant local business discovery source
- Fallback: alternate public directory strategy or cached dataset
- Deduplicate by normalized business name plus address
- Never invent missing website, email, or phone data
- Keep no-website businesses and mark `website_missing = true`

### 3. Website research

- Visit websites with Playwright only where necessary
- Capture visible content, contact paths, CTA state, service clarity, and booking evidence
- Mark blocked or thin sites as `manual_review_required`
- Continue processing even if one business fails

### 4. Audit and scoring

- Separate `observed_facts`, `reasonable_inferences`, and `recommendations`
- Score website quality, SEO opportunity, automation opportunity, and ads readiness
- Compute overall opportunity, urgency, ease of closing, and lead priority

### 5. Sales output generation

- Recommend primary and secondary services to pitch
- Build a practical pitch plan
- Generate concise outreach email drafts and follow-up copy

### 6. Export

- Generate spreadsheet-safe rows in a stable column order
- CSV download route
- Google Sheets posting can reuse the exact row schema

## Folder structure

```text
local-lead-audit-platform/
├── app/
│   ├── (dashboard)/
│   │   └── runs/
│   │       └── [runId]/
│   │           ├── page.tsx
│   │           ├── export/page.tsx
│   │           └── leads/[leadId]/page.tsx
│   ├── api/
│   │   ├── runs/route.ts
│   │   ├── runs/[runId]/route.ts
│   │   ├── runs/[runId]/export/route.ts
│   │   └── templates/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   ├── leads/
│   └── ui/
├── lib/
│   ├── ai/prompts.ts
│   ├── db/repository.ts
│   ├── export/sheets.ts
│   ├── research/
│   │   ├── adapters/google-places.ts
│   │   ├── adapters/fallback-directory.ts
│   │   ├── discovery.ts
│   │   └── site-audit.ts
│   ├── sample-data/
│   ├── scoring/
│   └── utils/
├── prisma/schema.prisma
├── types/index.ts
├── .env.example
└── README.md
```

## Database schema

Primary tables:

- `ResearchRun`
- `Lead`
- `RunLog`

Stored JSON payloads:

- `audit`
- `scoring`
- `serviceRecommendation`
- `pitchPlan`
- `outreach`

Recommended production indexes:

- `Lead(researchRunId)`
- `Lead(industry)`
- `Lead(leadPriority)`
- `RunLog(researchRunId, phase)`

## Data model highlights

- `DiscoveryBusiness`: raw discovery shape
- `WebsiteAudit`: grounded audit output with facts, inferences, and recommendations
- `LeadScoreCard`: opportunity framework
- `ServiceRecommendation`: what to sell and why
- `PitchPlan`: sales call prep
- `OutreachDraft`: cold email subject, body, and follow-up
- `ExportRow`: Google Sheets-ready row

## AI prompt system

Internal prompts included for:

1. Business summarization
2. Website audit
3. Service recommendation
4. Pitch plan
5. Cold email generation

All prompts explicitly prohibit fabricated claims and restrict grounding to:

- listing data
- visible website content
- public context supplied to the model

## Lead scoring framework

Inputs:

- website quality
- SEO opportunity
- automation opportunity
- ads readiness
- website missing or manual review flags

Outputs:

- `website_quality_score`
- `seo_opportunity_score`
- `automation_opportunity_score`
- `ads_readiness_score`
- `overall_opportunity_score`
- `opportunity_band`
- `urgency_level`
- `ease_of_closing_estimate`
- `lead_priority`

## Service recommendation framework

Decision order:

1. Weak or missing website -> `Website Redesign`
2. Automation gap -> `CRM Automation` or `Missed-Call Text Back`
3. SEO gap -> `Local SEO`
4. Otherwise -> `Paid Ads` plus `Lead Nurturing`

## Cold email generation framework

Rules:

- concise
- human
- personalized
- mention one real observation when available
- no fake guarantees
- no spammy tone
- one clear CTA

## Google Sheets columns

```text
business_name
industry
sub_category
location_targeted
address
city
state
postal_code
phone
email
website
google_maps_url
rating
review_count
hours
social_links
multiple_locations
active_status
website_present
website_quality_score
website_design_notes
mobile_friendly_estimate
cta_present
booking_flow_present
trust_elements_present
offer_clarity
conversion_issues
seo_opportunity_score
seo_notes
local_seo_opportunities
ads_readiness_score
ads_notes
automation_opportunity_score
automation_notes
primary_service_to_pitch
secondary_service_to_pitch
why_this_service
top_problem_found
missed_opportunity
pitch_angle
expected_business_impact
urgency_level
ease_of_closing_estimate
overall_opportunity_score
lead_priority
personalized_opening_line
cold_email_subject
cold_email_body
followup_email_body
notes_for_sales_call
```

## 10 sample cold email starters

1. Quick idea for bookings based on a visible site issue
2. Missed opportunity spotted on the website
3. More consultations without more admin load
4. Short audit offer for local market positioning
5. Paid traffic readiness concern
6. Fast win focused on booking flow
7. Show-up rate improvement through follow-up
8. Local SEO plus conversion thought
9. Missed-call recovery angle
10. Practical audit with no generic fluff

The concrete text versions live in `lib/sample-data/templates.ts`.

## 10 sample pitch angles

1. Stronger conversion path before more traffic
2. Faster lead response to improve booking rates
3. Better funnel from first click to consultation
4. Service plus location SEO expansion
5. Landing page fixes before ads
6. Missed-call text back as a fast recovery win
7. No-show recovery over generic promotion
8. Better nurture after initial inquiry
9. Booking funnel optimization across all channels
10. Reactivation before additional spend

## 10 sample audit findings

1. No clear booking CTA above the fold
2. Thin service pages
3. Weak local keyword targeting
4. Trust signals not near conversion points
5. Mobile booking friction
6. No visible lead capture for undecided visitors
7. Limited before-and-after proof
8. Weak value proposition clarity
9. Paid traffic likely to underperform right now
10. Follow-up automation probably missing

## 10 sample service recommendations

1. Website Redesign
2. Booking Funnel Optimization
3. CRM Automation
4. Missed-Call Text Back
5. Local SEO
6. Review Generation
7. No-Show Recovery
8. Lead Nurturing
9. GoHighLevel Setup
10. Paid Ads

## Example sample output rows

### Sample lead 1

- business_name: `Houston Med Spa Collective 2`
- primary_service_to_pitch: `Website Redesign`
- top_problem_found: `The site likely needs a more direct booking CTA path from the hero section.`
- overall_opportunity_score: `7`
- lead_priority: `medium`

### Sample lead 2

- business_name: `Houston Med Spa Collective 5`
- website_present: `false`
- primary_service_to_pitch: `Website Redesign`
- secondary_service_to_pitch: `Booking Funnel Optimization`
- urgency_level: `high`

### Sample lead 3

- business_name: `Houston Med Spa Collective 9`
- primary_service_to_pitch: `CRM Automation`
- missed_opportunity: `Create service-plus-location landing pages for the highest-value treatments.`
- cold_email_subject: `Houston Med Spa Collective 9: quick booking growth idea`

## UI pages

1. Input page
2. Research progress page
3. Leads table page
4. Lead detail page
5. Export preview page

## Example API routes

- `POST /api/runs`
- `GET /api/runs/[runId]`
- `GET /api/runs/[runId]/export`
- `GET /api/templates`

## Error handling expectations

- retry discovery and site fetch failures with backoff
- capture per-business logs
- never abort a full run because one business fails
- keep partial results
- mark uncertain results as `manual_review_required`
- leave unknown fields blank

## Setup instructions

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Add `DATABASE_URL`, `OPENAI_API_KEY`, and discovery provider credentials.
4. Run `npm install`.
5. Run `npx prisma generate`.
6. Run `npx prisma db push`.
7. Start the app with `npm run dev`.

## Deployment instructions

### Vercel

1. Create a Postgres database or connect Supabase/Neon.
2. Add environment variables in the Vercel project.
3. Set up Playwright support for background jobs or move browser work to a queue worker.
4. Deploy the Next.js app.

### Production recommendation

- Use a job queue for discovery and audits
- Persist screenshots and raw crawl outputs
- Store AI traces and token cost data
- Add operator controls for rerun, retry, and manual review

## V2 roadmap

- async jobs and background workers
- Playwright screenshot capture and DOM snapshots
- Google Sheets write-back
- enriched local SEO scoring
- duplicate suppression across runs
- user accounts and saved run presets

## V3 roadmap

- team collaboration and lead assignments
- multichannel outreach sequences
- direct CRM sync
- benchmark scoring across competitors
- offer library and dynamic pitch variants
- deeper analytics on close-rate by pitch type
