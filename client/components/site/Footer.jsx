export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
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
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Bridging surplus food from donors to communities in need while reducing waste and empowering impact.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/donations" className="hover:text-foreground">Donations</a></li>
            <li><a href="/impact" className="hover:text-foreground">Impact & Analytics</a></li>
            <li><a href="/about" className="hover:text-foreground">About</a></li>
            <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Get Involved</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Become a donor</li>
            <li>Join as an organization</li>
            <li>Volunteer & partnerships</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FoodBridge. All rights reserved.
      </div>
    </footer>
  );
}
