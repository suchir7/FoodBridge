import AnimatedCounter from "./AnimatedCounter";
import { Soup, Users, Building2 } from "lucide-react";
import { useMetrics } from "@/state/metrics";

export default function StatsStrip() {
  const { stats } = useMetrics();
  return (
    <section className="py-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 border-y border-border/60">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="rounded-2xl bg-background p-6 border border-border/60 shadow-sm">
          <div className="flex justify-center mb-1 text-emerald-600"><Soup className="h-5 w-5" /></div>
          <div className="text-3xl font-extrabold"><AnimatedCounter value={stats.mealsSavedToday || 0} suffix="+" /></div>
          <p className="text-xs text-muted-foreground">Meals Saved Today</p>
        </div>
        <div className="rounded-2xl bg-background p-6 border border-border/60 shadow-sm">
          <div className="flex justify-center mb-1 text-emerald-600"><Users className="h-5 w-5" /></div>
          <div className="text-3xl font-extrabold"><AnimatedCounter value={stats.activeDonors || 0} suffix="+" /></div>
          <p className="text-xs text-muted-foreground">Active Donors</p>
        </div>
        <div className="rounded-2xl bg-background p-6 border border-border/60 shadow-sm">
          <div className="flex justify-center mb-1 text-emerald-600"><Building2 className="h-5 w-5" /></div>
          <div className="text-3xl font-extrabold"><AnimatedCounter value={stats.organizationsHelped || 0} suffix="+" /></div>
          <p className="text-xs text-muted-foreground">Organizations Helped</p>
        </div>
      </div>
    </section>
  );
}
