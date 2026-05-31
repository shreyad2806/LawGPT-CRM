import { Card } from "@/components/ui/Card";
import { topHashtagsMockData } from "@/lib/mock-data/analytics";

export function TopHashtags() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Top Hashtags
      </h3>
      <div className="flex flex-wrap gap-2">
        {topHashtagsMockData.map((item) => (
          <span
            key={item.tag}
            className="px-3 py-1 bg-[#1F2937] text-blue-400 rounded-full text-xs font-medium hover:bg-[#2D3748] transition-colors cursor-pointer"
          >
            {item.tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
