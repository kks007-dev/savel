import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Train, DollarSign, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import type { Activity } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

interface ActivityCardProps {
  activity: Activity;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

export function ActivityCard({ activity, isRegenerating, onRegenerate }: ActivityCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3">
           <Image 
                src="https://placehold.co/400x400.png"
                alt={activity.description} 
                width={400} 
                height={400}
                className="w-full h-48 sm:h-full object-cover"
                data-ai-hint="travel activity"
            />
        </div>
        <div className="flex-1 p-6">
          <p className="font-semibold text-lg mb-4">{activity.description}</p>
          <div className="space-y-3 text-muted-foreground">
            {activity.metroStations && (
              <div className="flex items-center gap-3">
                <Train className="h-5 w-5 text-primary" />
                <span>{activity.metroStations}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>Cost: {activity.cost}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activity.link && (
              <Button asChild variant="outline" size="sm">
                <Link href={activity.link} target="_blank" rel="noopener noreferrer">
                  More Info <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={isRegenerating}>
              {isRegenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
