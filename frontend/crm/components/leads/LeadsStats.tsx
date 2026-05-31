import { Card } from "@/components/ui/Card";

export function LeadsStats() {
  const stats = [
    { label: "TOTAL LEADS", value: "4,821", subtext: "1.2% from last mo" },
    { label: "QUALIFIED LEADS", value: "1,029", subtext: "2.1% up" },
    { label: "HIGH INTENT LEADS", value: "312", subtext: "8.2% up" },
    { label: "CONVERSION OPPS", value: "89", subtext: "Ready to contact" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-3">
          <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-gray-500 text-xs">{stat.subtext}</p>
        </Card>
      ))}
    </div>
  );
}
