import { Card } from "@/components/ui/Card";

export function FollowupsStats() {
  const stats = [
    { label: "PENDING", value: "63", subtext: "Awaiting action" },
    { label: "READY TO SEND", value: "28", subtext: "Approved leads" },
    { label: "SENT", value: "847", all: "All time" },
    { label: "RESPONDED", value: "214", subtext: "25.3% rate" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-2">
            {stat.label}
          </p>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-gray-500 text-xs">{stat.subtext || stat.all}</p>
        </Card>
      ))}
    </div>
  );
}
