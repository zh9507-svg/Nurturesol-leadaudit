import { discoverViaFallbackDirectory } from "@/lib/research/adapters/fallback-directory";
import { discoverViaGooglePlaces } from "@/lib/research/adapters/google-places";
import type { DiscoveryBusiness, ResearchRunInput } from "@/types";

function dedupeBusinesses(items: DiscoveryBusiness[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${item.business_name.toLowerCase()}::${item.address?.toLowerCase() ?? ""}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function discoverBusinesses(input: ResearchRunInput) {
  const primary = await discoverViaGooglePlaces(input);
  const fallback = primary.length >= input.businessCount ? [] : await discoverViaFallbackDirectory(input);

  const merged = dedupeBusinesses([...primary, ...fallback])
    .filter((business) => (input.includeWithoutWebsites ? true : !business.website_missing))
    .filter((business) => (input.minimumRating ? (business.rating ?? 0) >= input.minimumRating : true))
    .slice(0, input.businessCount);

  return {
    strategy_used: primary.length > 0 ? "google-places->fallback-directory" : "fallback-directory",
    businesses: merged
  };
}
