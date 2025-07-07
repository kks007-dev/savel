import { Plane } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full py-8">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-2">
          <Plane className="size-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Teggie
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your AI-powered travel itinerary builder
        </p>
      </div>
    </header>
  );
}
