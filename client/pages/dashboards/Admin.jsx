import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import IndiaMap from "@/components/foodbridge/IndiaMap";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [d, r] = await Promise.all([api.getDonations(), api.getRequests()]);
            setDonations(d);
            setRequests(r);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateDonation = async (id, status) => {
        await api.updateDonationStatus(id, status);
        fetchData();
    };

    const updateRequest = async (id, status) => {
        await api.updateRequestStatus(id, status);
        fetchData();
    };

    // Analytics Data
    const donationStats = [
        { name: 'Pending', value: donations.filter(d => d.status === 'Pending').length },
        { name: 'Completed', value: donations.filter(d => ['Picked', 'Delivered'].includes(d.status)).length },
    ];

    const requestStats = [
        { name: 'Pending', value: requests.filter(r => r.status === 'Pending').length },
        { name: 'Approved', value: requests.filter(r => r.status === 'Approved').length },
        { name: 'Delivered', value: requests.filter(r => r.status === 'Delivered').length },
    ];

    const topDonors = Object.entries(donations.reduce((acc, curr) => {
        const name = curr.donor_name || curr.donor_email;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const mapMarkers = [
        ...donations.filter(d => d.location?.lat).map(d => ({
            id: d.id,
            position: { lat: d.location.lat, lng: d.location.lng },
            label: `Donation: ${d.details.type}`,
            color: 'green'
        })),
        ...requests.filter(r => r.location?.lat).map(r => ({
            id: r.id,
            position: { lat: r.location.lat, lng: r.location.lng },
            label: `Request: ${r.details.type}`,
            color: 'red'
        }))
    ];

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">Overview of system performance and management.</p>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="donations">Donations</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{donations.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{requests.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{topDonors.length}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Live Activity Map</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <IndiaMap height={350} markers={mapMarkers} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Donors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {topDonors.map((donor, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{donor.name}</p>
                                                <p className="text-sm text-muted-foreground">{donor.count} donations</p>
                                            </div>
                                            <div className="ml-auto font-medium">#{i + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader><CardTitle>Donation Status</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={donationStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                            {donationStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Request Status</CardTitle></CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={requestStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="donations">
                    <Card>
                        <CardHeader><CardTitle>Manage Donations</CardTitle></CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40"><tr><th className="p-3 text-left">Donor</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                                    <tbody>
                                        {donations.map((d) => (
                                            <tr key={d.id} className="border-t">
                                                <td className="p-3">{d.donor_name} <span className="text-muted-foreground">({d.donor_email})</span></td>
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
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="requests">
                    <Card>
                        <CardHeader><CardTitle>Manage Requests</CardTitle></CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40"><tr><th className="p-3 text-left">Organization</th><th className="p-3 text-left">Type</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                                    <tbody>
                                        {requests.map((r) => (
                                            <tr key={r.id} className="border-t">
                                                <td className="p-3">{r.org_name} <span className="text-muted-foreground">({r.requester_email})</span></td>
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
