export interface Trend {
  id: number;
  title: string;
  summary: string;
  category: string;
  trend_score: number;
  urgency: string;
  url: string;
  published_at?: string;
  created_at?: string;
}
