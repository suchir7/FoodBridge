import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/state/auth";

const REQ_KEY = "fb_requests";

export default function RecipientDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(REQ_KEY) || "[]")); } catch {}
  }, []);
  const my = useMemo(() => items.filter((d) => d.requesterEmail === user?.email), [items, user]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Recipient Dashboard</h1>
      <p className="text-sm text-muted-foreground">Track your requests</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr><th className="p-3 text-left">When</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Urgency</th><th className="p-3">Status</th></tr></thead>
          <tbody>
            {my.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-3">{new Date(d.createdAt).toLocaleString()}</td>
                <td className="p-3">{d.details.type}</td>
                <td className="p-3">{d.details.quantity}</td>
                <td className="p-3 capitalize">{d.details.urgency}</td>
                <td className="p-3">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
