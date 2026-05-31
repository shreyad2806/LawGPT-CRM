import { Card } from "@/components/ui/Card";

interface Recommendation {
  text: string;
  priority: "high" | "medium" | "low";
}

const recommendations: Recommendation[] = [
  {
    text: "Increase AI Contract Review content frequency",
    priority: "high",
  },
  {
    text: "Create more compliance-focused carousels",
    priority: "high",
  },
  {
    text: "Use statistic-driven hooks",
    priority: "medium",
  },
  {
    text: "Prioritize LinkedIn over Twitter",
    priority: "medium",
  },
  {
    text: "Expand case study content",
    priority: "low",
  },
];

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-red-500/10 text-red-400",
    medium: "bg-blue-500/10 text-blue-400",
    low: "bg-gray-500/10 text-gray-400",
  };

  const labels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

export function StrategyRecommendations() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Strategy Recommendations
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <PriorityBadge priority={rec.priority} />
            <p className="text-gray-400 text-xs flex-1 pt-0.5">{rec.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
