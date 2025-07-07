'use client';

import { useState, useTransition } from 'react';
import { generateTravelItinerary } from '@/ai/flows/generate-travel-itinerary';
import { regenerateActivity } from '@/ai/flows/regenerate-activity';
import { useToast } from '@/hooks/use-toast';
import { Itinerary, ItineraryInput } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { TripForm } from '@/components/trip-form';
import { ItinerarySkeleton } from '@/components/itinerary-skeleton';
import { InitialView } from '@/components/initial-view';
import { ItineraryDisplay } from '@/components/itinerary-display';

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [currentDestinations, setCurrentDestinations] = useState('');
  const [formInput, setFormInput] = useState<ItineraryInput | null>(null);
  const [isGenerating, startGeneration] = useTransition();
  const [regeneratingIndex, setRegeneratingIndex] = useState<{ day: number; activity: number } | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = (data: ItineraryInput) => {
    setItinerary(null);
    const destinationNames = data.destinations.map(d => d.name).join(', ');
    setCurrentDestinations(destinationNames);
    setFormInput(data);

    startGeneration(async () => {
      try {
        const result = await generateTravelItinerary(data);
        setItinerary(result);
      } catch (error) {
        console.error('Error generating itinerary:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to generate itinerary. Please try again.',
        });
      }
    });
  };

  const handleRegenerateActivity = async (dayIndex: number, activityIndex: number) => {
    if (!itinerary || !formInput) return;
    
    setRegeneratingIndex({ day: dayIndex, activity: activityIndex });
    
    const activityToReplace = itinerary.dailyItineraries[dayIndex].activities[activityIndex];
    const destinationForActivity = itinerary.dailyItineraries[dayIndex].destination;

    try {
      const result = await regenerateActivity({
        location: destinationForActivity,
        activity: activityToReplace.description,
        originalItinerary: JSON.stringify(itinerary),
        budget: formInput.budget,
        interests: formInput.interests || '',
      });

      const updatedItinerary = JSON.parse(JSON.stringify(itinerary));
      updatedItinerary.dailyItineraries[dayIndex].activities[activityIndex].description = result.newActivity;
      
      setItinerary(updatedItinerary);
    } catch (error) {
      console.error('Error regenerating activity:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to regenerate activity. Please try again.',
      });
    } finally {
      setRegeneratingIndex(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <TripForm onSubmit={handleFormSubmit} isLoading={isGenerating} />
          <div className="mt-12">
            {isGenerating ? (
              <ItinerarySkeleton />
            ) : itinerary ? (
              <ItineraryDisplay
                itinerary={itinerary}
                onRegenerate={handleRegenerateActivity}
                regeneratingIndex={regeneratingIndex}
                destination={currentDestinations}
              />
            ) : (
              <InitialView />
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>Powered by Gemini AI. Travel responsibly.</p>
      </footer>
    </div>
  );
}
