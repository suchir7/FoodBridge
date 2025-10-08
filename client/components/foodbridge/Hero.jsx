import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Route, Handshake } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <svg className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px]" viewBox="0 0 1100 1100" fill="none">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path d="M100 400 C 250 250, 450 250, 600 400 S 950 550, 1000 400" stroke="url(#g)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <motion.circle r="10" fill="#34d399" initial={{ pathLength: 0 }} animate={{ x: [100, 600, 1000], y: [400, 400, 400] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        </svg>
      </div>
      <div className="container mx-auto px-4 py-24 md:py-28 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-muted-foreground">
            <Handshake className="h-3.5 w-3.5 text-emerald-500" /> Bridging surplus food to those who need it most
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Reduce Food Waste. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Nourish Communities.</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground">
            FoodBridge connects donors with recipient organizations while admins oversee operations and analysts track real-time impact.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="px-6">
              <Link to="/donate" className="inline-flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" /> Donate Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="px-6">
              <Link to="/request">Request Food</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-6">
              <Link to="/impact" className="inline-flex items-center gap-2">
                <Route className="h-4 w-4" /> Track Impact
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
