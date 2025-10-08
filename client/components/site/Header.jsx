import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuth, dashboardPath } from "@/state/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const nav = [
    { to: "/", label: "Home" },
    { to: "/donations", label: "Donations" },
    { to: "/impact", label: "Impact" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg"
            style={{
              backgroundImage:
                "url(https://cdn.builder.io/api/v1/image/assets%2F546df735e2784d83bf3066367252fa11%2Fa5701d8f3dc643908f7faabc796ff296)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <span className="font-extrabold tracking-tight text-lg">FoodBridge</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
                  isActive && "text-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/request">Request Food</Link>
          </Button>
          <Button asChild>
            <Link to="/donate">Donate Now</Link>
          </Button>
          {user ? (
            <>
              <Button asChild variant="outline">
                <Link to={dashboardPath(user.role)}>Dashboard</Link>
              </Button>
              <Button variant="ghost" onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className={({ isActive }) => cn("py-1", isActive && "text-foreground font-semibold")}>
                {n.label}
              </NavLink>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="ghost" className="flex-1 min-w-[120px]">
                <Link to="/request" onClick={() => setOpen(false)}>Request Food</Link>
              </Button>
              <Button asChild className="flex-1 min-w-[120px]">
                <Link to="/donate" onClick={() => setOpen(false)}>Donate Now</Link>
              </Button>
              {user ? (
                <>
                  <Button asChild variant="outline" className="flex-1 min-w-[120px]">
                    <Link to={dashboardPath(user.role)} onClick={() => setOpen(false)}>Dashboard</Link>
                  </Button>
                  <Button variant="ghost" className="flex-1 min-w-[120px]" onClick={() => { signOut(); setOpen(false); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="flex-1 min-w-[120px]">
                    <Link to="/signin" onClick={() => setOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild variant="secondary" className="flex-1 min-w-[120px]">
                    <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
