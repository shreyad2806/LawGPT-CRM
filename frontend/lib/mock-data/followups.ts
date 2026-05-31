export interface Followup {
  id: string;
  lead: string;
  company: string;
  type: "Connection" | "Value Add" | "Case Study";
  status: "Pending" | "Ready" | "Sent" | "Responded";
  scheduled: string;
  preview: string;
}

export const followupsMockData: Followup[] = [
  {
    id: "1",
    lead: "Sarah Chen",
    company: "Orrick LLP",
    type: "Connection",
    status: "Ready",
    scheduled: "Today 10:00 AM",
    preview: "Loved your recent post on AI compliance. Would love to connect.",
  },
  {
    id: "2",
    lead: "Marcus Reyes",
    company: "Latham & Watkins",
    type: "Value Add",
    status: "Pending",
    scheduled: "Today 2:00 PM",
    preview: "Sharing a recent report on legal automation trends.",
  },
  {
    id: "3",
    lead: "Priya Nair",
    company: "Freshfields",
    type: "Case Study",
    status: "Sent",
    scheduled: "Yesterday",
    preview: "We helped a legal team reduce contract review time by 60%.",
  },
  {
    id: "4",
    lead: "James Liu",
    company: "Dentons",
    type: "Connection",
    status: "Responded",
    scheduled: "2 days ago",
    preview: "Thanks for connecting. Looking forward to learning more.",
  },
  {
    id: "5",
    lead: "Anika Patel",
    company: "DLA Piper",
    type: "Value Add",
    status: "Ready",
    scheduled: "Tomorrow",
    preview: "Thought this GDPR compliance benchmark might interest you.",
  },
  {
    id: "6",
    lead: "Tom Bradley",
    company: "Baker McKenzie",
    type: "Case Study",
    status: "Pending",
    scheduled: "Tomorrow",
    preview: "Sharing how firms are using AI to streamline due diligence.",
  },
];
