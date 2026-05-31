import { Card } from "@/components/ui/Card";

export function BestPerformers() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Best Performers
      </h3>
      <div className="space-y-4">
        {/* Best Hook */}
        <div className="border-b border-[#1F2937] pb-4">
          <p className="text-gray-400 text-xs font-semibold uppercase mb-2">
            Best Hook
          </p>
          <p className="text-white text-sm font-medium mb-2">
            "Most law firms waste 40% of review time manually"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Performance</span>
            <span className="text-green-400 font-semibold text-sm">9.4/10</span>
          </div>
        </div>

        {/* Best CTA */}
        <div className="border-b border-[#1F2937] pb-4">
          <p className="text-gray-400 text-xs font-semibold uppercase mb-2">
            Best CTA
          </p>
          <p className="text-white text-sm font-medium mb-2">
            "Try LawGPT Free"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Performance</span>
            <span className="text-green-400 font-semibold text-sm">8.9/10</span>
          </div>
        </div>

        {/* Best Topic */}
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase mb-2">
            Best Topic
          </p>
          <p className="text-white text-sm font-medium mb-2">
            "AI Contract Review"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs">Performance</span>
            <span className="text-green-400 font-semibold text-sm">9.7/10</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
