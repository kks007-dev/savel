import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Train, DollarSign, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import type { Activity } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { generateActivityImage } from '@/ai/flows/generate-activity-image';
import { Skeleton } from './ui/skeleton';

interface ActivityCardProps {
  activity: Activity;
  destination: string;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

export function ActivityCard({ activity, destination, isRegenerating, onRegenerate }: ActivityCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    
    const fetchImage = async () => {
      setIsImageLoading(true);
      setImageUrl(null);
      try {
        const result = await generateActivityImage({
          description: activity.description,
          location: destination,
        });
        if (!isCancelled) {
          setImageUrl(result.imageUrl);
        }
      } catch (error) {
        console.error("Failed to generate image:", error);
      } finally {
        if (!isCancelled) {
          setIsImageLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isCancelled = true;
    };
  }, [activity.description, destination]);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/3 relative">
          {isImageLoading ? (
            <Skeleton className="w-full h-48 sm:h-full" />
          ) : (
            <Image
              src={imageUrl || "https://placehold.co/400x400.png"}
              alt={activity.description}
              width={400}
              height={400}
              className="w-full h-48 sm:h-full object-cover"
              data-ai-hint={activity.description.split(' ').slice(0, 2).join(' ')}
            />
          )}
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
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={isRegenerating || isImageLoading}>
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
