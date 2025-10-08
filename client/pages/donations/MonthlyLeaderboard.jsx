import { computeMonthlyTopDonors } from "@/state/metrics";
import { useEffect, useState } from "react";

export default function MonthlyLeaderboard() {
  const [, setVersion] = useState(0);
  useEffect(() => {
    const onChange = () => setVersion((v) => v + 1);
    window.addEventListener("fb:data-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("fb:data-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const top = computeMonthlyTopDonors();
  if (!top || top.length === 0) {
    return <div className="text-sm text-muted-foreground">No donations yet this month.</div>;
  }
  return (
    <ol className="space-y-2">
      {top.map((t, i) => (
        <li key={t.name} className="flex items-center justify-between rounded-lg border border-border/60 p-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-semibold">{i + 1}</span>
            <span className="font-medium truncate max-w-[160px]">{t.name}</span>
          </div>
          <span className="text-sm text-muted-foreground">{t.value}</span>
        </li>
      ))}
    </ol>
  );
}
