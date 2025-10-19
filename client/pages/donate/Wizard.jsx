import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressInput } from "@/components/ui/address-input";
import ErrorBoundary from "@/components/ui/error-boundary";
import MapPicker from "@/components/foodbridge/MapPicker";
import { useAuth } from "@/state/auth";

const DONATIONS_KEY = "fb_donations";
function readDonations() { try { return JSON.parse(localStorage.getItem(DONATIONS_KEY) || "[]"); } catch { return []; } }
function writeDonations(d) { localStorage.setItem(DONATIONS_KEY, JSON.stringify(d)); try { window.dispatchEvent(new Event("fb:data-changed")); } catch {} }

export default function DonorWizard() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [img, setImg] = useState();
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    donorEmail: user?.email || "",
    donorName: user?.name || "",
    phone: "",
    image: undefined,
    details: { name: "", type: "cooked", quantity: "", packed: "packed", expiry: "6 hours", description: "" },
    location: { address: "", lat: 0, lng: 0 },
    status: "Pending",
    createdAt: Date.now(),
  });
  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const onImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const src = String(reader.result); setImg(src); setForm((f) => ({ ...f, image: src })); };
    reader.readAsDataURL(file);
  };

  const onSubmit = () => {
    const list = readDonations();
    list.unshift(form);
    writeDonations(list);
    setStep(4);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Donate Surplus Food</h1>
        <p className="text-sm text-muted-foreground">Step {Math.min(step + 1, 4)} of 4</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-semibold mb-4">Food Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Food name</Label>
                  <Input className="mt-1" placeholder="e.g., Veg Biryani, Bread Loaves" value={form.details.name} onChange={(e) => setForm((f) => ({ ...f, details: { ...f.details, name: e.target.value } }))} />
                </div>
                <div>
                  <Label>Food type</Label>
                  <Select value={form.details.type} onValueChange={(v) => setForm((f) => ({ ...f, details: { ...f.details, type: v } }))}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooked">Cooked</SelectItem>
                      <SelectItem value="raw">Raw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input className="mt-1" placeholder="e.g., 20 plates or 10 kg" value={form.details.quantity} onChange={(e) => setForm((f) => ({ ...f, details: { ...f.details, quantity: e.target.value } }))} />
                </div>
                <div>
                  <Label>Packed</Label>
                  <Select value={form.details.packed} onValueChange={(v) => setForm((f) => ({ ...f, details: { ...f.details, packed: v } }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="packed">Packed</SelectItem>
                      <SelectItem value="unpacked">Unpacked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Best before</Label>
                  <Input className="mt-1" placeholder="e.g., 6 hours" value={form.details.expiry} onChange={(e) => setForm((f) => ({ ...f, details: { ...f.details, expiry: e.target.value } }))} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Description (optional)</Label>
                  <Textarea className="mt-1" rows={3} value={form.details.description} onChange={(e) => setForm((f) => ({ ...f, details: { ...f.details, description: e.target.value } }))} />
                </div>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-semibold mb-4">Pickup Location</h2>
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
              <p className="text-xs text-muted-foreground mt-2">Drag on the map to set the pickup pin.</p>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="contact" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-semibold mb-4">Contact Info</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Donor name</Label>
                  <Input className="mt-1" value={form.donorName} onChange={(e) => setForm((f) => ({ ...f, donorName: e.target.value }))} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Email</Label>
                  <Input type="email" className="mt-1" value={form.donorEmail} onChange={(e) => setForm((f) => ({ ...f, donorEmail: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Upload image</Label>
                  <Input type="file" accept="image/*" className="mt-1" onChange={(e) => onImage(e.target.files?.[0])} />
                  {img && <img src={img} alt="food" className="mt-3 h-40 w-full object-cover rounded-lg border" />}
                </div>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-semibold mb-4">Confirmation</h2>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {form.details.name || "—"}</div>
                <div><strong>Type:</strong> {form.details.type}</div>
                <div><strong>Quantity:</strong> {form.details.quantity}</div>
                <div><strong>Packed:</strong> {form.details.packed}</div>
                <div><strong>Best before:</strong> {form.details.expiry}</div>
                {form.details.description && <div><strong>Description:</strong> {form.details.description}</div>}
                <div><strong>Address:</strong> {form.location.address}</div>
                <div><strong>Contact:</strong> {form.donorName} · {form.phone} · {form.donorEmail}</div>
              </div>
              <div className="mt-4">
                <Button onClick={onSubmit} className="w-full">Confirm Donation</Button>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 grid place-items-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="mt-4 text-xl font-bold">Thank you!</h3>
              <p className="text-muted-foreground mt-1">You just helped feed 25 people!</p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setStep(0)}>Add another</Button>
                <Button asChild><a href="/dashboard/donor">Go to Dashboard</a></Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step < 4 && (
        <div className="mt-4 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>Back</Button>
          <div className="text-xs text-muted-foreground">Progress</div>
          <Button onClick={next} disabled={step === 3}>Next</Button>
        </div>
      )}
    </div>
  );
}
