import AnimatedCounter from "@/components/foodbridge/AnimatedCounter";
import { useMetrics } from "@/state/metrics";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* data now comes from metrics */
const weekly = [
  { day: "Mon", donations: 120 },
  { day: "Tue", donations: 180 },
  { day: "Wed", donations: 150 },
  { day: "Thu", donations: 220 },
  { day: "Fri", donations: 200 },
  { day: "Sat", donations: 260 },
  { day: "Sun", donations: 190 },
];

const types = [
  { name: "Cooked", value: 56, fill: "hsl(var(--primary))" },
  { name: "Raw", value: 24, fill: "#10b981" },
  { name: "Packed", value: 14, fill: "#34d399" },
  { name: "Unpacked", value: 6, fill: "#6ee7b7" },
];

const topDonors = [
  { name: "Green Deli", value: 320 },
  { name: "City Events", value: 280 },
  { name: "FreshMart", value: 240 },
  { name: "Campus Cafe", value: 210 },
];

export default function Impact() {
  const { stats, impact } = useMetrics();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10 p-6 text-center shadow-sm">
          <div className="text-xs text-muted-foreground">Meals Saved</div>
          <div className="mt-1 text-3xl font-extrabold"><AnimatedCounter value={(impact.weekly?.reduce((s, d) => s + (d.donations || 0), 0)) || 0} /></div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10 p-6 text-center shadow-sm">
          <div className="text-xs text-muted-foreground">Active Donors</div>
          <div className="mt-1 text-3xl font-extrabold"><AnimatedCounter value={stats.activeDonors || 0} /></div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10 p-6 text-center shadow-sm">
          <div className="text-xs text-muted-foreground">Organizations Helped</div>
          <div className="mt-1 text-3xl font-extrabold"><AnimatedCounter value={stats.organizationsHelped || 0} /></div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Weekly Donations Trend</h3>
          <ChartContainer config={{ donations: { label: "Donations", color: "hsl(var(--primary))" } }}>
            <LineChart data={impact.weekly || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="donations" stroke="var(--color-donations)" strokeWidth={2} dot={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ChartContainer>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Distribution of Food Types</h3>
          <ChartContainer config={{ cooked: { label: "Cooked" }, raw: { label: "Raw" }, packed: { label: "Packed" }, unpacked: { label: "Unpacked" } }}>
            <PieChart>
              <Pie data={impact.types || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {(impact.types || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm lg:col-span-2">
          <h3 className="font-semibold mb-3">Top Donors</h3>
          <ChartContainer config={{ donors: { label: "Donations", color: "#10b981" } }}>
            <BarChart data={impact.topDonors || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Bar dataKey="value" fill="var(--color-donors)" radius={[6, 6, 0, 0]} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6">
        <p className="font-semibold">Environmental Impact</p>
        <p className="opacity-95 text-sm mt-1">FoodBridge has saved 25,000 kg food = 50,000 liters water + 12,000 kg CO₂ reduced.</p>
      </div>
    </div>
  );
}
