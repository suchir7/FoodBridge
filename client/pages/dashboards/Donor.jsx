import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DonorDashboard() {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await api.getDonations();
            setDonations(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const my = useMemo(() => donations.filter((d) => d.donor_email === user?.email), [donations, user]);
    const pendingApprovals = useMemo(() => my.filter((d) => d.status === "Pending"), [my]);

    const approvePickup = async (id) => {
        await api.updateDonationStatus(id, "Approved");
        fetchData();
    };

    // Prepare chart data (donations by month)
    const chartData = useMemo(() => {
        const months = {};
        my.forEach(d => {
            const month = new Date(d.created_at).toLocaleString('default', { month: 'short' });
            months[month] = (months[month] || 0) + 1;
        });
        return Object.entries(months).map(([name, value]) => ({ name, value }));
    }, [my]);

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Donor Dashboard</h1>
            <p className="text-muted-foreground mb-8">Track your impact and manage donations.</p>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader><CardTitle>Your Impact</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">{my.length}</div>
                        <p className="text-sm text-muted-foreground">Total donations made</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Donation History</CardTitle></CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {pendingApprovals.length > 0 && (
                <Card className="mb-8 border-orange-200 bg-orange-50/50">
                    <CardHeader><CardTitle className="text-orange-700">Action Required</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Requests to pick up your donations.</p>
                        <div className="space-y-3">
                            {pendingApprovals.map((d) => (
                                <div key={d.id} className="flex items-center justify-between rounded-lg border bg-white p-3">
                                    <div>
                                        <div className="font-medium">{d.details.type} • {d.details.quantity}</div>
                                        <div className="text-xs text-muted-foreground">Created {new Date(d.created_at).toLocaleString()}</div>
                                    </div>
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending Pickup</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>Your Donations</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40"><tr><th className="p-3 text-left">When</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Status</th></tr></thead>
                            <tbody>
                                {my.map((d) => (
                                    <tr key={d.id} className="border-t">
                                        <td className="p-3">{new Date(d.created_at).toLocaleString()}</td>
                                        <td className="p-3 capitalize">{d.details.type}</td>
                                        <td className="p-3">{d.details.quantity}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${d.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
