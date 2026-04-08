import { slugify } from "@/lib/utils/format";
import type { DiscoveryBusiness, ResearchRunInput } from "@/types";

export async function discoverViaFallbackDirectory(input: ResearchRunInput): Promise<DiscoveryBusiness[]> {
  const city = input.location.split(",")[0]?.trim() || input.location;
  const state = input.location.split(",")[1]?.trim() || "";

  return Array.from({ length: input.businessCount }).map((_, index) => {
    const suffix = index + 1;
    const name = `${city} ${input.industry} Collective ${suffix}`;

    return {
      business_name: name,
      category: input.industry,
      industry: input.industry,
      sub_category: index % 2 === 0 ? input.industry : "Beauty & Wellness",
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`,
      website: index % 4 === 0 ? "" : `https://${slugify(name)}.com`,
      phone: `(555) 010-${String(1000 + suffix).slice(-4)}`,
      email: index % 3 === 0 ? `hello@${slugify(name)}.com` : "",
      address: `${120 + suffix} Main Street`,
      city,
      state,
      postal_code: `77${String(100 + suffix).slice(-3)}`,
      rating: Number((4 + ((suffix % 8) * 0.1)).toFixed(1)),
      review_count: 14 + suffix * 7,
      hours: {
        Mon: "9:00 AM - 6:00 PM",
        Tue: "9:00 AM - 6:00 PM",
        Wed: "9:00 AM - 6:00 PM"
      },
      social_links: [`https://instagram.com/${slugify(name)}`],
      multiple_locations: suffix % 5 === 0,
      active_status: "active",
      website_missing: index % 4 === 0,
      location_targeted: input.location,
      discovery_source: "fallback-directory-demo"
    };
  });
}
