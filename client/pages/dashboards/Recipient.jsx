import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/state/auth";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndiaMap from "@/components/foodbridge/IndiaMap";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function RecipientDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [r, d] = await Promise.all([api.getRequests(), api.getDonations()]);
                setRequests(r);
                setDonations(d.filter(item => item.status === 'Pending')); // Only show available donations
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const myRequests = useMemo(() => requests.filter((d) => d.requester_email === user?.email), [requests, user]);

    const mapMarkers = donations.filter(d => d.location?.lat).map(d => ({
        id: d.id,
        position: { lat: d.location.lat, lng: d.location.lng },
        label: `${d.details.type} • ${d.details.quantity}`,
        color: 'green',
        onClick: () => navigate(`/request?donationId=${d.id}`) // Navigate to request form with pre-fill
    }));

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Recipient Dashboard</h1>
            <p className="text-muted-foreground mb-8">Find food and track your requests.</p>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Nearby Available Food</CardTitle></CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[400px] w-full rounded-md overflow-hidden border">
                            <IndiaMap height={400} markers={mapMarkers} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">Click on a green marker to request that donation.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4 bg-muted/20">
                                <div className="text-2xl font-bold">{myRequests.length}</div>
                                <div className="text-sm text-muted-foreground">Total Requests</div>
                            </div>
                            <div className="rounded-lg border p-4 bg-green-50/50 border-green-100">
                                <div className="text-2xl font-bold text-green-700">{myRequests.filter(r => r.status === 'Approved').length}</div>
                                <div className="text-sm text-green-600">Approved</div>
                            </div>
                            <Button className="w-full" onClick={() => navigate('/request')}>New General Request</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Your Request History</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40"><tr><th className="p-3 text-left">When</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Urgency</th><th className="p-3">Status</th></tr></thead>
                            <tbody>
                                {myRequests.map((d) => (
                                    <tr key={d.id} className="border-t">
                                        <td className="p-3">{new Date(d.created_at).toLocaleString()}</td>
                                        <td className="p-3">{d.details.type}</td>
                                        <td className="p-3">{d.details.quantity}</td>
                                        <td className="p-3 capitalize">{d.details.urgency}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${d.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                d.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                                }`}>
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
