const DONATIONS_KEY = "fb_donations";
const REQUESTS_KEY = "fb_requests";

function readJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function parseQuantity(q) {
  if (!q || typeof q !== "string") return 0;
  const m = q.match(/\d+(?:[\.,]\d+)?/);
  return m ? Math.floor(Number(m[0].replace(",", "."))) : 0;
}

function isToday(ts) {
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function computeStats() {
  const donations = readJSON(DONATIONS_KEY, []);
  const requests = readJSON(REQUESTS_KEY, []);

  const mealsSavedToday = donations
    .filter((d) => isToday(d.createdAt))
    .reduce((sum, d) => sum + (parseQuantity(d?.details?.quantity) || 1), 0);

  const activeDonors = new Set(
    donations.map((d) => (d.donorEmail || d.donorName || "")).filter(Boolean)
  ).size;

  const organizationsHelped = new Set(
    requests.map((r) => r.orgName || r.requesterEmail || "").filter(Boolean)
  ).size;

  return { mealsSavedToday, activeDonors, organizationsHelped };
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

export function computeImpact() {
  const donations = readJSON(DONATIONS_KEY, []);

  // Weekly trend for last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const weekly = days.map((d) => {
    const key = dayKey(d);
    const total = donations
      .filter((x) => dayKey(new Date(x.createdAt)) === key)
      .reduce((sum, x) => sum + (parseQuantity(x?.details?.quantity) || 1), 0);
    const day = d.toLocaleDateString(undefined, { weekday: "short" });
    return { day, donations: total };
  });

  // Types distribution
  const cooked = donations.filter((d) => d?.details?.type === "cooked").length;
  const raw = donations.filter((d) => d?.details?.type === "raw").length;
  const packed = donations.filter((d) => d?.details?.packed === "packed").length;
  const unpacked = donations.filter((d) => d?.details?.packed === "unpacked").length;
  const types = [
    { name: "Cooked", value: cooked, fill: "hsl(var(--primary))" },
    { name: "Raw", value: raw, fill: "#10b981" },
    { name: "Packed", value: packed, fill: "#34d399" },
    { name: "Unpacked", value: unpacked, fill: "#6ee7b7" },
  ];

  // Top donors by quantity donated (fallback to count)
  const totals = new Map();
  for (const d of donations) {
    const key = d.donorName || d.donorEmail || "Anonymous";
    const qty = parseQuantity(d?.details?.quantity) || 1;
    totals.set(key, (totals.get(key) || 0) + qty);
  }
  const topDonors = Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return { weekly, types, topDonors };
}

export function computeMonthlyTopDonors(date = new Date()) {
  const donations = readJSON(DONATIONS_KEY, []);
  const y = date.getFullYear();
  const m = date.getMonth();
  const totals = new Map();
  for (const d of donations) {
    const dt = new Date(d.createdAt);
    if (dt.getFullYear() !== y || dt.getMonth() !== m) continue;
    const key = d.donorName || d.donorEmail || "Anonymous";
    const qty = parseQuantity(d?.details?.quantity) || 1;
    totals.set(key, (totals.get(key) || 0) + qty);
  }
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

import { useEffect, useMemo, useState } from "react";

export function useMetrics() {
  const [ver, setVer] = useState(0);
  const refresh = () => setVer((v) => v + 1);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener("storage", onChange);
    window.addEventListener("fb:data-changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("fb:data-changed", onChange);
    };
  }, []);

  const stats = useMemo(() => computeStats(), [ver]);
  const impact = useMemo(() => computeImpact(), [ver]);

  return { stats, impact, refresh };
}

export function notifyDataChanged() {
  try { window.dispatchEvent(new Event("fb:data-changed")); } catch {}
}
