import HowItWorks from "@/components/foodbridge/HowItWorks";
import StatsStrip from "@/components/foodbridge/StatsStrip";

export default function About() {
  return (
    <div className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About FoodBridge</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          FoodBridge is a student-led initiative developed by passionate university students who recognized the critical need to address food waste in our communities. As a group of young innovators, we created this platform to bridge the gap between surplus food and those who need it most, turning our academic learning into real-world impact.
        </p>
        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            <strong>Student Initiative:</strong> Developed by university students committed to using technology for social good and environmental sustainability.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10">
            <h3 className="font-semibold">Student Mission</h3>
            <p className="text-sm text-muted-foreground mt-1">We're students passionate about using technology to reduce food waste and fight hunger in our communities.</p>
          </div>
          <div className="rounded-2xl border p-6 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10">
            <h3 className="font-semibold">Learning & Impact</h3>
            <p className="text-sm text-muted-foreground mt-1">This project combines our academic studies with real-world problem solving for maximum community benefit.</p>
          </div>
          <div className="rounded-2xl border p-6 bg-gradient-to-br from-background to-emerald-50/40 dark:to-emerald-900/10">
            <h3 className="font-semibold">Environmental Focus</h3>
            <p className="text-sm text-muted-foreground mt-1">Every meal saved reduces waste, lowers carbon footprint, and helps build sustainable communities.</p>
          </div>
        </div>
      </section>
      <HowItWorks />
      <StatsStrip />
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl border p-6">
          <h3 className="font-semibold mb-2">Our Student Story</h3>
          <p className="text-sm text-muted-foreground mb-4">
            As university students, we witnessed firsthand the amount of food waste in our campus dining halls, local restaurants, and community events. Motivated by the United Nations Sustainable Development Goals and our passion for technology, we decided to create a solution that could make a real difference.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            FoodBridge represents our commitment to using our technical skills for social good. Through this platform, we're learning about full-stack development, user experience design, and community impact measurement while simultaneously addressing one of society's most pressing challenges.
          </p>
          <p className="text-sm text-muted-foreground">
            We partner with local restaurants, campus dining services, and community organizations to ensure surplus food reaches those who need it most. Every donation through our platform represents a step toward a more sustainable and equitable future.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
          <h3 className="font-semibold mb-2 text-emerald-800 dark:text-emerald-200">Join Our Mission</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Whether you're a student, restaurant owner, or community member, you can help us reduce food waste and fight hunger. Together, we're building a more sustainable future, one meal at a time.
          </p>
        </div>
      </section>
    </div>
  );
}
