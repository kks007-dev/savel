import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { HotelSuggestion } from "@/lib/types";

interface HotelCardProps {
  hotel: HotelSuggestion;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">{hotel.name}</CardTitle>
                <CardDescription className="pt-1">Cost: {hotel.cost}</CardDescription>
            </div>
            <Hotel className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full gap-2 bg-accent hover:bg-accent/90">
          <Link href={hotel.bookingLink} target="_blank" rel="noopener noreferrer">
            Book Now
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
