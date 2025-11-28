import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dashboardPath, useAuth } from "@/state/auth";

export default function SignUp() {
    const { signUp } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("donor");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const u = await signUp({ name, email, role, phone, location, organization: role === "recipient" ? name : undefined }, password);
            window.location.href = dashboardPath(u.role);
        } catch (e) {
            setError(e.message || "Unable to sign up");
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-md">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Create your account</h1>
            <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm space-y-4">
                {error && <div className="text-sm text-red-600">{error}</div>}
                <div>
                    <Label>Full/Organization Name</Label>
                    <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v)}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="donor">Donor</SelectItem>
                            <SelectItem value="recipient">Recipient</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Contact Number</Label>
                    <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                    <Label>Location (optional)</Label>
                    <Input className="mt-1" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">Sign Up</Button>
                <p className="text-xs text-muted-foreground text-center">Already have an account? <a className="underline" href="/signin">Sign In</a></p>
            </form>
        </div>
    );
}
