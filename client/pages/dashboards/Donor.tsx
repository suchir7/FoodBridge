import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";

const DONATIONS_KEY = "fb_donations";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  useEffect(() => {
    try { setDonations(JSON.parse(localStorage.getItem(DONATIONS_KEY) || "[]")); } catch {}
  }, []);
  const my = useMemo(() => donations.filter((d) => d.donorEmail === user?.email), [donations, user]);
  const pendingApprovals = useMemo(() => my.filter((d) => d.status === "Pending"), [my]);

  const approvePickup = (id) => {
    const updated = donations.map((d) => (d.id === id ? { ...d, status: "Approved" } : d));
    setDonations(updated);
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Donor Dashboard</h1>
      <p className="text-sm text-muted-foreground">Track your donations</p>
      {pendingApprovals.length > 0 && (
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="font-semibold mb-2">Approvals</h2>
          <p className="text-sm text-muted-foreground mb-3">Requests to pick up your donations.</p>
          <div className="space-y-3">
            {pendingApprovals.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{d.details.type} • {d.details.quantity}</div>
                  <div className="text-xs text-muted-foreground">Created {new Date(d.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-x-2">
                  <Button size="sm" onClick={() => approvePickup(d.id)}>Approve Pickup</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr><th className="p-3 text-left">When</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Status</th></tr></thead>
          <tbody>
            {my.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3 capitalize">{d.details.type}</td>
                <td className="p-3">{d.details.quantity}</td>
                <td className="p-3">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
