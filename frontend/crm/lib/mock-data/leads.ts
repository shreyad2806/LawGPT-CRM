export interface Lead {
  id: string;
  name: string;
  company: string;
  role: string;
  platform: "LinkedIn" | "Twitter/X";
  engagement: string;
  score: number;
  category: "Partner" | "C-Level" | "Associate";
  status: "Qualified" | "Review" | "Pending";
}

export const leadsMockData: Lead[] = [
  {
    id: "1",
    name: "Sarah Chen",
    company: "Orrick LLP",
    role: "Partner",
    platform: "LinkedIn",
    engagement: "Post Comment",
    score: 92,
    category: "C-Level",
    status: "Qualified",
  },
  {
    id: "2",
    name: "Marcus Reyes",
    company: "Latham & Watkins",
    role: "Sr. Partner",
    platform: "LinkedIn",
    engagement: "Multiple Interactions",
    score: 88,
    category: "Partner",
    status: "Qualified",
  },
  {
    id: "3",
    name: "Priya Nair",
    company: "Freshfields",
    role: "Head of Legal",
    platform: "LinkedIn",
    engagement: "DM Inquiry",
    score: 84,
    category: "C-Level",
    status: "Qualified",
  },
  {
    id: "4",
    name: "James Liu",
    company: "Dentons",
    role: "Associate",
    platform: "Twitter/X",
    engagement: "Retweet",
    score: 79,
    category: "Associate",
    status: "Review",
  },
  {
    id: "5",
    name: "Anika Patel",
    company: "DLA Piper",
    role: "GC",
    platform: "LinkedIn",
    engagement: "Post Share",
    score: 76,
    category: "C-Level",
    status: "Qualified",
  },
  {
    id: "6",
    name: "Tom Bradley",
    company: "Baker McKenzie",
    role: "Partner",
    platform: "LinkedIn",
    engagement: "Like + Comment",
    score: 71,
    category: "Partner",
    status: "Review",
  },
  {
    id: "7",
    name: "Elena Voss",
    company: "Clifford Chance",
    role: "Sr. Associate",
    platform: "LinkedIn",
    engagement: "Comment",
    score: 65,
    category: "Associate",
    status: "Pending",
  },
];
