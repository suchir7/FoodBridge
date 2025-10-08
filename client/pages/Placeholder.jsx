import { Link } from "react-router-dom";

export default function Placeholder({ title, description }) {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{description}</p>
      <p className="mt-6 text-sm text-muted-foreground">
        Want this page fully built next? Tell me what you want here in the chat and I'll generate it.
      </p>
      <div className="mt-8">
        <Link to="/impact" className="text-primary underline underline-offset-4 hover:no-underline">See Impact & Analytics</Link>
      </div>
    </div>
  );
}
