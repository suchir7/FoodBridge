import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CONTACTS_KEY = "fb_contacts";
function readContacts(): any[] { try { return JSON.parse(localStorage.getItem(CONTACTS_KEY) || "[]"); } catch { return []; } }
function writeContacts(d: any[]) { localStorage.setItem(CONTACTS_KEY, JSON.stringify(d)); try { window.dispatchEvent(new Event("fb:data-changed")); } catch {} }

const SUPPORTS_KEY = "fb_supports";
function readSupports(): any[] { try { return JSON.parse(localStorage.getItem(SUPPORTS_KEY) || "[]"); } catch { return []; } }
function writeSupports(d: any[]) { localStorage.setItem(SUPPORTS_KEY, JSON.stringify(d)); try { window.dispatchEvent(new Event("fb:data-changed")); } catch {} }

export default function Contact() {
  const [tab, setTab] = useState("contact");

  // Contact form
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "" });
  const onSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    const list = readContacts();
    list.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), type: "contact", ...contact });
    writeContacts(list);
    setContactSuccess(true);
  };

  // Support form
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [support, setSupport] = useState({ name: "", email: "", topic: "issue", urgency: "normal", message: "" });
  const onSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    const list = readSupports();
    list.unshift({ id: crypto.randomUUID(), createdAt: Date.now(), type: "support", ...support });
    writeSupports(list);
    setSupportSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-14 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact & Support</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          We're a student team passionate about reducing food waste. Reach out for partnerships, feedback, or support with our platform.
        </p>
      </div>

      {/* Contact Information Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10">
          <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">General Inquiries</h3>
          <p className="text-sm text-muted-foreground">Partnerships, media, or general questions about FoodBridge.</p>
        </div>
        
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-background to-blue-50/40 dark:to-blue-900/10">
          <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Feedback & Ideas</h3>
          <p className="text-sm text-muted-foreground">Share your thoughts, suggestions, or feature requests.</p>
        </div>
        
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-background to-orange-50/40 dark:to-orange-900/10">
          <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Technical Support</h3>
          <p className="text-sm text-muted-foreground">Help with platform issues, bugs, or account problems.</p>
        </div>
      </div>

      {/* Student Team Info */}
      <div className="rounded-2xl border p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 mb-8">
        <h3 className="font-semibold mb-2 text-emerald-800 dark:text-emerald-200">Student Development Team</h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
          FoodBridge is developed by university students as part of our commitment to using technology for social good. 
          We're always looking for feedback to improve our platform and expand our impact.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">University Students</span>
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Food Waste Reduction</span>
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Community Impact</span>
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">Open to Feedback</span>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Feedback & Contact</TabsTrigger>
          <TabsTrigger value="support">Technical Support</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          {!contactSuccess ? (
            <form onSubmit={onSubmitContact} className="mt-4 rounded-2xl border border-border/60 bg-background p-6 shadow-sm space-y-4">
              <div>
                <Label>Name / Organization</Label>
                <Input className="mt-1" placeholder="Your name or organization" value={contact.name} onChange={(e) => setContact((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" className="mt-1" placeholder="your.email@example.com" value={contact.email} onChange={(e) => setContact((f) => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <Label>Subject</Label>
                <Input className="mt-1" placeholder="e.g., Partnership inquiry, Feature suggestion, General feedback" value={contact.subject} onChange={(e) => setContact((f) => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea rows={5} className="mt-1" placeholder="Share your thoughts, suggestions, or questions about FoodBridge. We're always looking for ways to improve our platform and expand our impact!" value={contact.message} onChange={(e) => setContact((f) => ({ ...f, message: e.target.value }))} required />
              </div>
              <Button type="submit" className="w-full">Send Feedback</Button>
            </form>
          ) : (
            <div className="mt-4 rounded-2xl border border-border/60 bg-background p-8 shadow-sm text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 grid place-items-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="mt-4 text-xl font-bold">Feedback received!</h3>
              <p className="text-muted-foreground mt-1">Thank you for reaching out! Our student team will review your message and get back to you soon.</p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button asChild variant="outline"><a href="/">Back Home</a></Button>
                <Button asChild><a href="/donations">View Donations</a></Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="support">
          {!supportSuccess ? (
            <form onSubmit={onSubmitSupport} className="mt-4 rounded-2xl border border-border/60 bg-background p-6 shadow-sm space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input className="mt-1" value={support.name} onChange={(e) => setSupport((f) => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" className="mt-1" value={support.email} onChange={(e) => setSupport((f) => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Topic</Label>
                  <Select value={support.topic} onValueChange={(v) => setSupport((f) => ({ ...f, topic: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issue">Platform Issue / Bug</SelectItem>
                      <SelectItem value="account">Account Access</SelectItem>
                      <SelectItem value="donation">Donation Process</SelectItem>
                      <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Urgency</Label>
                  <Select value={support.urgency} onValueChange={(v) => setSupport((f) => ({ ...f, urgency: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Describe your issue or request</Label>
                <Textarea rows={5} className="mt-1" placeholder="Please provide details about the issue you're experiencing or the support you need. Our student team will do our best to help!" value={support.message} onChange={(e) => setSupport((f) => ({ ...f, message: e.target.value }))} required />
              </div>
              <Button type="submit" className="w-full">Submit Support Request</Button>
            </form>
          ) : (
            <div className="mt-4 rounded-2xl border border-border/60 bg-background p-8 shadow-sm text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-600 grid place-items-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="mt-4 text-xl font-bold">Support request submitted</h3>
              <p className="text-muted-foreground mt-1">Thank you! Our student development team will review your request and respond as soon as possible.</p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button asChild variant="outline"><a href="/">Back Home</a></Button>
                <Button asChild><a href="/impact">View Impact</a></Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
