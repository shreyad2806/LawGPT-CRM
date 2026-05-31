export interface TopHashtag {
  tag: string;
  count: number;
}

export interface BestPerformer {
  hook: string;
  engagement: string;
  platform: string;
}

export const topHashtagsMockData: TopHashtag[] = [
  { tag: "#LegalTech", count: 234 },
  { tag: "#AI", count: 189 },
  { tag: "#ContractReview", count: 156 },
  { tag: "#Compliance", count: 142 },
  { tag: "#LawFirm", count: 128 },
];

export const bestPerformersMockData: BestPerformer[] = [
  {
    hook: "Most lawyers still review contracts manually",
    engagement: "8.2% CTR",
    platform: "LinkedIn",
  },
  {
    hook: "GDPR fines hit €42B in 2024",
    engagement: "7.8% CTR",
    platform: "LinkedIn",
  },
  {
    hook: "3 hidden risks in employment contracts",
    engagement: "7.4% CTR",
    platform: "Carousel",
  },
];
