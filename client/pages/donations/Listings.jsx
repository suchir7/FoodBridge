import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MonthlyLeaderboard from "./MonthlyLeaderboard";

const DONATIONS_KEY = "fb_donations";

// filter shape: { type: 'all'|'cooked'|'raw', packed: 'all'|'packed'|'unpacked', q: string }

function percentFromLatLng(lat, lng) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((-lat + 90) / 180) * 100;
  return { x, y };
}

export default function DonationListings() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ type: "all", packed: "all", q: "" });
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(DONATIONS_KEY) || "[]")); } catch {}
  }, []);

  const filtered = useMemo(() => {
    return items.filter((d) => {
      if (d.status !== "Pending") return false;
      if (filter.type !== "all" && d.details.type !== filter.type) return false;
      if (filter.packed !== "all" && d.details.packed !== filter.packed) return false;
      const q = filter.q.toLowerCase();
      if (q && !(`${d.details.description || ""} ${d.location.address}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [items, filter]);

  const active = filtered.find((i) => i.id === activeId) || null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Donation Listings</h1>
        <p className="text-sm text-muted-foreground">Public map and list of current surplus food near you with filters.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="min-w-[160px]">
              <Select value={filter.type} onValueChange={(v) => setFilter((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="cooked">Cooked</SelectItem>
                  <SelectItem value="raw">Raw</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[160px]">
              <Select value={filter.packed} onValueChange={(v) => setFilter((f) => ({ ...f, packed: v }))}>
                <SelectTrigger><SelectValue placeholder="Packaging" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All packaging</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="unpacked">Unpacked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Search address or description" value={filter.q} onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))} className="max-w-xs" />
          </div>

          <div className="relative h-[450px] w-full overflow-hidden rounded-xl border border-border/60 bg-[url('https://tile.openstreetmap.org/5/15/10.png')] bg-cover bg-center">
            <div className="absolute inset-0">
              {filtered.filter((d) => d.location && (d.location.lat !== 0 || d.location.lng !== 0)).map((d) => {
                const { x, y } = percentFromLatLng(d.location.lat, d.location.lng);
                return (
                  <button
                    key={d.id}
                    className="absolute -translate-x-1/2 -translate-y-full"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setActiveId(d.id)}
                    title={`${d.donorName ? d.donorName + " — " : ""}${d.details.quantity} ${d.details.name ? "• " + d.details.name : ""}`}
                  >
                    <svg width="26" height="26" viewBox="0 0 24 24" fill={activeId === d.id ? "#0ea5e9" : "#10b981"} stroke="#0f172a" strokeWidth="0.5"><path d="M12 22s8-4.5 8-12a8 8 0 1 0-16 0c0 7.5 8 12 8 12Z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>
                  </button>
                );
              })}
            </div>
          </div>

          {active && (
            <div className="mt-4 rounded-xl border p-4">
              <div className="flex items-start gap-3">
                {active.image ? (
                  <img src={active.image} alt="food" className="h-20 w-24 rounded-md object-cover border" />
                ) : (
                  <div className="h-20 w-24 rounded-md bg-muted" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{active.details.type}</Badge>
                    <Badge variant="outline" className="capitalize">{active.details.packed}</Badge>
                  </div>
                  <div className="font-semibold mt-1">{active.details.quantity}{active.details.name ? ` • ${active.details.name}` : ""}</div>
                  <div className="text-xs text-muted-foreground">Best before: {active.details.expiry}</div>
                  <div className="text-xs text-muted-foreground">{active.location.address}</div>
                  <div className="text-xs text-muted-foreground">Donor: {active.donorName || active.donorEmail || "Anonymous"}</div>
                </div>
                <Button asChild><a href="/request">Request</a></Button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Available donations</h3>
          <div className="space-y-3 max-h-[450px] overflow-auto pr-2">
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">No matching donations now. Check back soon or <a className="underline" href="/donate">donate surplus food</a>.</div>
            ) : (
              filtered.map((d) => (
                <button key={d.id} onClick={() => setActiveId(d.id)} className={`w-full text-left rounded-lg border p-3 ${activeId === d.id ? "border-emerald-500" : "border-border/60"}`}>
                  <div className="flex items-center gap-3">
                    {d.image ? (
                      <img src={d.image} alt="food" className="h-12 w-16 rounded-md object-cover border" />
                    ) : (
                      <div className="h-12 w-16 rounded-md bg-muted" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{d.details.quantity}{d.details.name ? ` • ${d.details.name}` : ""} • <span className="capitalize">{d.details.type}</span></div>
                      <div className="text-xs text-muted-foreground truncate">{d.location.address || "No address provided"}</div>
                      <div className="text-xs text-muted-foreground">Donor: {d.donorName || d.donorEmail || "Anonymous"}</div>
                      <div className="mt-1 flex gap-1"><Badge variant="outline" className="capitalize">{d.details.packed}</Badge><Badge variant="secondary">{d.status}</Badge></div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Top donors this month</h3>
          <MonthlyLeaderboard />
        </div>
      </div>
    </div>
  );
}
