import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressInput } from "@/components/ui/address-input";
import ErrorBoundary from "@/components/ui/error-boundary";
import MapPicker from "@/components/foodbridge/MapPicker";
import { useAuth } from "@/state/auth";

const REQ_KEY = "fb_requests";
function readReq() { try { return JSON.parse(localStorage.getItem(REQ_KEY) || "[]"); } catch { return []; } }
function writeReq(d) { localStorage.setItem(REQ_KEY, JSON.stringify(d)); try { window.dispatchEvent(new Event("fb:data-changed")); } catch {} }

export default function RequestForm() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    requesterEmail: user?.email || "",
    orgName: user?.organization || user?.name || "",
    contact: "",
    details: { type: "Cooked", quantity: "", urgency: "today" },
    location: { address: "", lat: 0, lng: 0 },
    status: "Pending",
    createdAt: Date.now(),
  });

  const submit = () => {
    const list = readReq();
    list.unshift(form);
    writeReq(list);
    setSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Request Food</h1>
      {!success ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Type of food</Label>
              <Select value={form.details.type} onValueChange={(v) => setForm((f) => ({ ...f, details: { ...f.details, type: v } }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cooked">Cooked</SelectItem>
                  <SelectItem value="Raw">Raw</SelectItem>
                  <SelectItem value="Packed">Packed</SelectItem>
                  <SelectItem value="Unpacked">Unpacked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity needed</Label>
              <Input className="mt-1" placeholder="e.g., 30 plates or 15 kg" value={form.details.quantity} onChange={(e) => setForm((f) => ({ ...f, details: { ...f.details, quantity: e.target.value } }))} />
            </div>
            <div>
              <Label>Urgency</Label>
              <Select value={form.details.urgency} onValueChange={(v) => setForm((f) => ({ ...f, details: { ...f.details, urgency: v as any } }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Organization name</Label>
              <Input className="mt-1" value={form.orgName} onChange={(e) => setForm((f) => ({ ...f, orgName: e.target.value }))} />
            </div>
            <div>
              <Label>Contact person & phone</Label>
              <Input className="mt-1" placeholder="Name · Phone" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Address</Label>
              <ErrorBoundary>
                <AddressInput
                  value={form.location.address}
                  onChange={(address) => setForm((f) => ({ ...f, location: { ...f.location, address } }))}
                  onLocationSelect={(location) => setForm((f) => ({ 
                    ...f, 
                    location: { 
                      ...f.location, 
                      address: location.address,
                      lat: location.lat,
                      lng: location.lng
                    } 
                  }))}
                  placeholder="Start typing an address..."
                  className="mt-1 mb-4"
                />
              </ErrorBoundary>
              <MapPicker value={{ lat: form.location.lat, lng: form.location.lng }} onChange={(pos) => setForm((f) => ({ ...f, location: { ...f.location, ...pos } }))} />
            </div>
          </div>
          <div className="mt-6">
            <Button className="w-full" onClick={submit}>Submit Request</Button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-border/60 bg-background p-8 shadow-sm text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 grid place-items-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h3 className="mt-4 text-xl font-bold">Request submitted</h3>
          <p className="text-muted-foreground mt-1">We will notify you once a matching donation is available.</p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button asChild variant="outline"><a href="/">Back Home</a></Button>
            <Button asChild><a href="/dashboard/recipient">Go to Dashboard</a></Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
