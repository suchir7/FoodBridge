import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import type { Donation } from "@/pages/donate/Wizard";
import type { RequestItem } from "@/pages/request/RequestForm";

const DONATIONS_KEY = "fb_donations";
const REQ_KEY = "fb_requests";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    try { setDonations(JSON.parse(localStorage.getItem(DONATIONS_KEY) || "[]")); } catch {}
    try { setRequests(JSON.parse(localStorage.getItem(REQ_KEY) || "[]")); } catch {}
  }, []);

  const updateDonation = (id: string, status: Donation["status"]) => {
    const updated = donations.map((d) => (d.id === id ? { ...d, status } : d));
    setDonations(updated); localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
  };
  const updateRequest = (id: string, status: RequestItem["status"]) => {
    const updated = requests.map((d) => (d.id === id ? { ...d, status } : d));
    setRequests(updated); localStorage.setItem(REQ_KEY, JSON.stringify(updated));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground">Manage donations and requests</p>

      <section className="mt-6">
        <h2 className="font-semibold mb-2">Donations</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40"><tr><th className="p-3 text-left">Donor</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.donorName} <span className="text-muted-foreground">({d.donorEmail})</span></td>
                  <td className="p-3 capitalize">{d.details.type}</td>
                  <td className="p-3">{d.details.quantity}</td>
                  <td className="p-3">{d.status}</td>
                  <td className="p-3 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => updateDonation(d.id, "Picked")}>Mark Picked</Button>
                    <Button size="sm" onClick={() => updateDonation(d.id, "Delivered")}>Mark Delivered</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold mb-2">Requests</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40"><tr><th className="p-3 text-left">Organization</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.orgName} <span className="text-muted-foreground">({r.requesterEmail})</span></td>
                  <td className="p-3">{r.details.type}</td>
                  <td className="p-3">{r.details.quantity}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => updateRequest(r.id, "Approved")}>Approve</Button>
                    <Button size="sm" onClick={() => updateRequest(r.id, "Delivered")}>Mark Delivered</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
