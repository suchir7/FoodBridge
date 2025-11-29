import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalystDashboard() {
    const [stats, setStats] = useState({
        donations: [],
        requests: [],
        loading: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [donations, requests] = await Promise.all([
                    api.getDonations(),
                    api.getRequests()
                ]);
                setStats({ donations, requests, loading: false });
            } catch (error) {
                console.error("Failed to fetch data", error);
                setStats(s => ({ ...s, loading: false }));
            }
        };
        fetchData();
    }, []);

    if (stats.loading) return <div className="p-10">Loading analytics...</div>;

    // Metrics
    const totalDonations = stats.donations.length;
    const totalRequests = stats.requests.length;
    const activeDeliveries = stats.donations.filter(d => d.status === 'In Progress').length;
    const completedDonations = stats.donations.filter(d => d.status === 'Completed').length;

    // Chart Data
    const statusData = [
        { name: 'Pending', value: stats.donations.filter(d => d.status === 'Pending').length },
        { name: 'In Progress', value: stats.donations.filter(d => d.status === 'In Progress').length },
        { name: 'Completed', value: stats.donations.filter(d => d.status === 'Completed').length },
    ].filter(d => d.value > 0);

    // Mock trend data (since we don't have historical data in this mock)
    const trendData = [
        { name: 'Mon', donations: 4, requests: 2 },
        { name: 'Tue', donations: 3, requests: 5 },
        { name: 'Wed', donations: 7, requests: 3 },
        { name: 'Thu', donations: 5, requests: 4 },
        { name: 'Fri', donations: 8, requests: 6 },
        { name: 'Sat', donations: 12, requests: 8 },
        { name: 'Sun', donations: 10, requests: 7 },
    ];

    // Filter locations for map
    const mapMarkers = stats.donations
        .filter(d => d.location && d.location.lat && d.location.lng)
        .map(d => ({ ...d, type: 'Donation' }))
        .concat(stats.requests
            .filter(r => r.location && r.location.lat && r.location.lng)
            .map(r => ({ ...r, type: 'Request' }))
        );

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analyst Dashboard</h1>
                    <p className="text-muted-foreground">Real-time platform insights and performance metrics.</p>
                </div>
                <Button onClick={() => window.print()}>Export Report</Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDonations}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalRequests}</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeDeliveries}</div>
                        <p className="text-xs text-muted-foreground">Currently in transit</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedDonations * 10}</div>
                        <p className="text-xs text-muted-foreground">Meals served successfully</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="donations" fill="#8884d8" name="Donations" />
                                <Bar dataKey="requests" fill="#82ca9d" name="Requests" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Donation Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Map Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Live Activity Map</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] p-0 overflow-hidden rounded-b-xl">
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {mapMarkers.map((marker, idx) => (
                            <Marker key={idx} position={[marker.location.lat, marker.location.lng]}>
                                <Popup>
                                    <strong>{marker.type}</strong><br />
                                    {marker.details || marker.summary}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Details</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...stats.donations.map(d => ({ ...d, type: 'Donation' })), ...stats.requests.map(r => ({ ...r, type: 'Request' }))]
                                    .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
                                    .slice(0, 10)
                                    .map((item, i) => (
                                        <tr key={i} className="border-b hover:bg-muted/50">
                                            <td className="px-4 py-3 font-medium">{item.type}</td>
                                            <td className="px-4 py-3">{item.details?.foodItem || item.details?.type || 'Food Item'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(item.created_at || item.createdAt).toLocaleDateString()}
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
