import { Card } from "@/components/ui/Card";

export function AnalyticsStats() {
  const stats = [
    {
      label: "AVG ENGAGEMENT SCORE",
      value: "7.4",
      subtext: "↑ 11% last month",
    },
    {
      label: "BEST TOPIC",
      value: "AI Contract Review",
      subtext: "Highest CTR 8.2%",
    },
    {
      label: "BEST HOOK PATTERN",
      value: "Stat + Consequence",
      value2: "11.4 CTR",
    },
    {
      label: "BEST CTA",
      value: "Try LawGPT Free",
      subtext: "9.2% click rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-3">
          <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {stat.label}
          </p>
          <p className="text-lg font-bold text-white mb-1">{stat.value}</p>
          {stat.value2 && <p className="text-gray-400 text-xs mb-1">{stat.value2}</p>}
          {stat.subtext && <p className="text-gray-500 text-xs">{stat.subtext}</p>}
        </Card>
      ))}
    </div>
  );
}
