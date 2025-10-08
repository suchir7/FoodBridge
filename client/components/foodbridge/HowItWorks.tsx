import { motion } from "framer-motion";
import { ClipboardList, MapPin, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Donor lists surplus food",
    desc: "Add details like type, quantity, packaging and expiry time.",
  },
  {
    icon: MapPin,
    title: "Recipient requests",
    desc: "Nearby NGOs and shelters request what they need with map pickup.",
  },
  {
    icon: CheckCircle2,
    title: "Food delivered → Impact shown",
    desc: "Track delivery status and see meals served + environmental savings.",
  },
];

export default function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">How FoodBridge Works</h2>
        <p className="text-muted-foreground mt-2">A simple 3-step flow from donation to impact.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10 p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 text-emerald-500/50">
                <svg width="40" height="20" viewBox="0 0 40 20" fill="none"><path d="M0 10 H32" stroke="currentColor" strokeWidth="2"/><path d="M24 4 L32 10 L24 16" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
