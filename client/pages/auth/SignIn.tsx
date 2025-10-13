import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, dashboardPath } from "@/state/auth";

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const u = await signIn(email, password);
      window.location.href = dashboardPath(u.role);
    } catch (e: any) {
      setError(e.message || "Unable to sign in");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">Sign In</h1>
      <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm space-y-4">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <Label>Email</Label>
          <Input type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
        <p className="text-xs text-muted-foreground text-center">No account? <a className="underline" href="/signup">Sign Up</a></p>
      </form>
    </div>
  );
}
