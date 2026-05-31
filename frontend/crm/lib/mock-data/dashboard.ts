export interface RecentContent {
  id: string;
  hook: string;
  status: string;
  platform: string;
}

export interface TopQualifiedLead {
  id: string;
  name: string;
  company: string;
  score: number;
}

export const recentContentMockData: RecentContent[] = [
  {
    id: "1",
    hook: "Most lawyers still review contracts manually",
    status: "Draft",
    platform: "LinkedIn",
  },
  {
    id: "2",
    hook: "GDPR fines hit €42B in 2024",
    status: "Approved",
    platform: "LinkedIn",
  },
  {
    id: "3",
    hook: "3 hidden risks in employment contracts",
    status: "Draft",
    platform: "Carousel",
  },
];

export const topQualifiedLeadsMockData: TopQualifiedLead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Orrick LLP",
    score: 92,
  },
  {
    id: "2",
    name: "Marcus Reyes",
    company: "Latham & Watkins",
    score: 88,
  },
  {
    id: "3",
    name: "Priya Nair",
    company: "Freshfields",
    score: 84,
  },
];
