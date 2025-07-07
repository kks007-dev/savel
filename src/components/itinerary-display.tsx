import type { Itinerary } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HotelCard } from "./hotel-card";
import { ActivityCard } from "./activity-card";
import { Card } from "./ui/card";
import Image from "next/image";

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onRegenerate: (dayIndex: number, activityIndex: number) => Promise<void>;
  regeneratingIndex: { day: number; activity: number } | null;
  destination: string;
}

export function ItineraryDisplay({ itinerary, onRegenerate, regeneratingIndex, destination }: ItineraryDisplayProps) {
  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Hotel Suggestions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itinerary.hotelSuggestions.map((hotel, index) => (
            <HotelCard key={index} hotel={hotel} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Your Itinerary for {destination}</h2>
        <Accordion type="single" collapsible defaultValue="day-0" className="w-full space-y-4">
          {itinerary.dailyItineraries.map((day, dayIndex) => (
            <AccordionItem value={`day-${dayIndex}`} key={dayIndex} className="bg-card border-none rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:border-b">
                  Day {day.day}
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-6">
                    {day.activities.map((activity, activityIndex) => (
                      <ActivityCard
                        key={activityIndex}
                        activity={activity}
                        isRegenerating={
                          regeneratingIndex?.day === dayIndex &&
                          regeneratingIndex?.activity === activityIndex
                        }
                        onRegenerate={() => onRegenerate(dayIndex, activityIndex)}
                      />
                    ))}
                  </div>
                </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
