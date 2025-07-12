import type { Itinerary, TransportSuggestion, CostEffectiveTransportSuggestion } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HotelCard } from "./hotel-card";
import { ActivityCard } from "./activity-card";
import { TransportCard } from "./transport-card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Plane, Train, Bus, ExternalLink, Ticket, TramFront } from "lucide-react";

interface ItineraryDisplayProps {
  itinerary: Itinerary;
  onRegenerate: (dayIndex: number, activityIndex: number) => Promise<void>;
  regeneratingIndex: { day: number; activity: number } | null;
  destination: string;
}

const transportIcons: Record<string, React.ElementType> = {
  Flight: Plane,
  Train: Train,
  Bus: Bus,
};

function TransportSuggestions({ suggestions }: { suggestions: TransportSuggestion[] }) {
  if (!suggestions || suggestions.length === 0) {
    return <p className="text-muted-foreground p-4">No transport suggestions available.</p>;
  }

  return (
    <div className="space-y-4 p-4">
      {suggestions.map((suggestion, index) => {
        const Icon = transportIcons[suggestion.type] || Plane;
        return (
          <div key={index} className="p-4 rounded-lg border bg-card/50 flex items-start gap-4">
            <Icon className="h-6 w-6 text-primary mt-1" />
            <div className="flex-grow">
              <h4 className="font-semibold">{suggestion.type}</h4>
              <p className="text-muted-foreground text-sm mb-2">{suggestion.description}</p>
              <Button asChild variant="link" className="p-0 h-auto">
                <Link href={suggestion.bookingLink} target="_blank" rel="noopener noreferrer">
                  Booking Link <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CostEffectiveTransport({ suggestions }: { suggestions: CostEffectiveTransportSuggestion[] }) {
  if (!suggestions || suggestions.length === 0) {
    return <p className="text-muted-foreground p-4">No cost-effective transport suggestions available.</p>;
  }

  return (
    <div className="space-y-6 p-4">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="p-4 rounded-lg border bg-card/50 flex items-start gap-4">
          <Ticket className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-accent mb-2">{suggestion.destination}</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <TramFront className="h-5 w-5"/>
                  City Transport Strategy
                </h4>
                <p className="text-muted-foreground text-sm">{suggestion.suggestion}</p>
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-1">
                  <Plane className="h-5 w-5"/>
                  Airport Transport
                </h4>
                <p className="text-muted-foreground text-sm">{suggestion.airportTransport}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


export function ItineraryDisplay({ itinerary, onRegenerate, regeneratingIndex, destination }: ItineraryDisplayProps) {
  const hotelsByDestination = itinerary.hotelSuggestions.reduce((acc, hotel) => {
    (acc[hotel.destination] = acc[hotel.destination] || []).push(hotel);
    return acc;
  }, {} as Record<string, typeof itinerary.hotelSuggestions>);

  return (
    <div className="space-y-12 animate-fade-in">
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['hotels', 'transport', 'cost-effective']}>
        <AccordionItem value="hotels" className="bg-card border-none rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="p-6 text-2xl font-bold tracking-tight hover:no-underline">
            Hotel Suggestions
          </AccordionTrigger>
          <AccordionContent className="p-6 pt-0">
            {Object.keys(hotelsByDestination).length > 0 ? (
              Object.entries(hotelsByDestination).map(([dest, hotels]) => (
                <div key={dest} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-semibold tracking-tight mb-4 text-primary">{dest}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel, index) => (
                      <HotelCard key={index} hotel={hotel} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No hotel suggestions available.</p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="transport" className="bg-card border-none rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="p-6 text-2xl font-bold tracking-tight hover:no-underline">
            Transportation Suggestions
          </AccordionTrigger>
          <AccordionContent>
            <TransportSuggestions suggestions={itinerary.transportSuggestions} />
          </AccordionContent>
        </AccordionItem>
         <AccordionItem value="cost-effective" className="bg-card border-none rounded-lg overflow-hidden shadow-sm">
          <AccordionTrigger className="p-6 text-2xl font-bold tracking-tight hover:no-underline">
            Cost-Effective Transport Plan
          </AccordionTrigger>
          <AccordionContent>
            <CostEffectiveTransport suggestions={itinerary.costEffectiveTransportSuggestions} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Your Itinerary for {destination}</h2>
        <Accordion type="single" collapsible defaultValue="day-0" className="w-full space-y-4">
          {itinerary.dailyItineraries.map((day, dayIndex) => (
            <AccordionItem value={`day-${dayIndex}`} key={dayIndex} className="bg-card border-none rounded-lg overflow-hidden shadow-sm">
                <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline data-[state=open]:border-b">
                  <div className="flex justify-between w-full pr-2">
                    <span>Day {day.day}</span>
                    <span className="font-normal text-sm text-muted-foreground">{day.destination}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-6">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex}>
                        <ActivityCard
                          activity={activity}
                          destination={day.destination}
                          isRegenerating={
                            regeneratingIndex?.day === dayIndex &&
                            regeneratingIndex?.activity === activityIndex
                          }
                          onRegenerate={() => onRegenerate(dayIndex, activityIndex)}
                        />
                        {activity.transportToNextActivity && activityIndex < day.activities.length - 1 && (
                          <TransportCard
                            description={activity.transportToNextActivity.description}
                            link={activity.transportToNextActivity.googleMapsLink}
                          />
                        )}
                      </div>
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
