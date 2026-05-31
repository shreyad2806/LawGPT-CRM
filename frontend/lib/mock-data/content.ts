export interface ContentItem {
  id: string;
  hook: string;
  cta: string;
  platform: "LinkedIn" | "Carousel";
  status: "Draft" | "Approved" | "Rejected" | "Posted";
  created: string;
}

export const contentMockData: ContentItem[] = [
  {
    id: "1",
    hook: "Most lawyers still review contracts manually",
    cta: "Try LawGPT free",
    platform: "LinkedIn",
    status: "Draft",
    created: "May 29",
  },
  {
    id: "2",
    hook: "GDPR fines hit €42B in 2024",
    cta: "See how we help",
    platform: "LinkedIn",
    status: "Approved",
    created: "May 28",
  },
  {
    id: "3",
    hook: "3 hidden risks in employment contracts",
    cta: "Get a free audit",
    platform: "Carousel",
    status: "Draft",
    created: "May 28",
  },
  {
    id: "4",
    hook: "IP theft costs startups $380K on average",
    cta: "Protect your IP now",
    platform: "LinkedIn",
    status: "Posted",
    created: "May 27",
  },
  {
    id: "5",
    hook: "The average M&A due diligence takes 6 weeks",
    cta: "Book a demo",
    platform: "Carousel",
    status: "Approved",
    created: "May 26",
  },
];
