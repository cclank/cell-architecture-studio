import type { CourseTier } from "../../data/curriculum/types";
import { TIER_BADGES } from "../../config/product";

// Tier badge. Text label is always present — colour never carries meaning alone.
export function TierBadge({ tier }: { tier: CourseTier }) {
  const badge = TIER_BADGES[tier];
  return <span className={`igb-badge ${badge.className}`}>{badge.label}</span>;
}

export function PracticalBadge() {
  return <span className={`igb-badge ${TIER_BADGES.PRACTICAL.className}`}>{TIER_BADGES.PRACTICAL.label}</span>;
}
