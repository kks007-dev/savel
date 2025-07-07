import { Compass, Sun, Mountain, Building2 } from "lucide-react";

export function InitialView() {
  return (
    <div className="text-center py-16 px-4 bg-card rounded-lg border border-dashed">
      <Compass className="mx-auto h-16 w-16 text-primary/50" />
      <h2 className="mt-6 text-2xl font-semibold tracking-tight">Plan Your Next Adventure</h2>
      <p className="mt-2 text-muted-foreground max-w-md mx-auto">
        Fill out the details above and let our AI craft a personalized travel itinerary just for you.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-primary/70" />
          <span>Beach Escapes</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary/70" />
          <span>City Tours</span>
        </div>
        <div className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-primary/70" />
          <span>Mountain Retreats</span>
        </div>
      </div>
    </div>
  );
}
