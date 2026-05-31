import { Card } from "@/components/ui/Card";

const hashtags = [
  "#LegalTech",
  "#AIForLawyers",
  "#ContractReview",
  "#Compliance",
  "#LawGPT",
  "#LegalAI",
  "#RiskManagement",
  "#CorporateLaw",
];

export function TopHashtags() {
  return (
    <Card className="p-4">
      <h3 className="text-white font-semibold mb-4 text-sm">
        Top Hashtags
      </h3>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-[#1F2937] text-blue-400 rounded-full text-xs font-medium hover:bg-[#2D3748] transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
