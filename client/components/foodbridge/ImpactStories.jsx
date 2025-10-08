import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const stories = [
  {
    quote:
      "Our restaurant donates daily via FoodBridge. Knowing meals reach shelters the same day is incredible.",
    author: "Amara, Bistro Verde",
  },
  {
    quote:
      "During floods, FoodBridge's emergency mode coordinated pickups to our relief center within hours.",
    author: "Kiran, Hope Relief Org",
  },
  {
    quote:
      "The analytics helped us plan donations to match real demand areas—less waste, more impact.",
    author: "Neel, City Events Co.",
  },
];

export default function ImpactStories() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Impact Stories</h2>
        <p className="text-muted-foreground mt-2">Real experiences from donors and recipient organizations.</p>
      </div>
      <div className="relative">
        <Carousel className="mx-auto max-w-4xl">
          <CarouselContent>
            {stories.map((s) => (
              <CarouselItem key={s.author}>
                <blockquote className="rounded-2xl border border-border/60 bg-background p-8 shadow-sm text-center mx-auto max-w-3xl">
                  <p className="text-lg md:text-xl leading-relaxed">“{s.quote}”</p>
                  <footer className="mt-4 text-sm text-muted-foreground">— {s.author}</footer>
                </blockquote>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
