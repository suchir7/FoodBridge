import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export type Report = { id: string; createdAt: number; summary: string };
const REPORTS_KEY = "fb_reports";

function readReports(): Report[] { try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]"); } catch { return []; } }
function writeReports(r: Report[]) { localStorage.setItem(REPORTS_KEY, JSON.stringify(r)); }

export default function AnalystDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => { setReports(readReports()); }, []);

  const saveSnapshot = () => {
    const r: Report = { id: crypto.randomUUID(), createdAt: Date.now(), summary: `Snapshot on ${new Date().toLocaleString()}` };
    const list = [r, ...reports];
    setReports(list); writeReports(list);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Analyst Dashboard</h1>
      <p className="text-sm text-muted-foreground">Save and track reports</p>
      <div className="mt-4"><Button onClick={saveSnapshot}>Save Report Snapshot</Button></div>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40"><tr><th className="p-3 text-left">When</th><th className="p-3 text-left">Summary</th></tr></thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-3">{r.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
