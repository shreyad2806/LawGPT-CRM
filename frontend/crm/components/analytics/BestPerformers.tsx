import { Card } from "@/components/ui/Card";
import { bestPerformersMockData } from "@/lib/mock-data/analytics";

export function BestPerformers() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Best Performers
      </h3>
      <div className="space-y-4">
        {bestPerformersMockData.map((item, index) => (
          <div key={index} className={index < bestPerformersMockData.length - 1 ? "border-b border-[#1F2937] pb-4" : ""}>
            <p className="text-gray-400 text-xs font-semibold uppercase mb-2">
              {index === 0 ? "Best Hook" : index === 1 ? "Best CTA" : "Best Topic"}
            </p>
            <p className="text-white text-sm font-medium mb-2">
              &ldquo;{item.hook}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Performance</span>
              <span className="text-green-400 font-semibold text-sm">{item.engagement}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
