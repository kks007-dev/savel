"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CalendarDays, DollarSign, Heart, Sparkles, Loader2, PlusCircle, Trash2, Users } from "lucide-react";
import type { ItineraryInput } from "@/lib/types";
import { cn } from "@/lib/utils";

const DestinationSchema = z.object({
  name: z.string().min(2, { message: "Destination must be at least 2 characters." }),
  durationDays: z.coerce.number().min(1, { message: "Duration must be at least 1 day." }),
});

const TravelItineraryInputSchema = z.object({
  destinations: z.array(DestinationSchema).min(1, "Please add at least one destination."),
  numberOfTravelers: z.coerce.number().min(1, { message: "Must be at least 1 traveler." }),
  budget: z.string().min(2, { message: "Please provide a budget (e.g., '$1000', 'moderate')." }),
  interests: z.string().optional(),
});

interface TripFormProps {
  onSubmit: (data: ItineraryInput) => void;
  isLoading: boolean;
}

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const form = useForm<ItineraryInput>({
    resolver: zodResolver(TravelItineraryInputSchema),
    defaultValues: {
      destinations: [{ name: "Paris, France", durationDays: 4 }, { name: "Rome, Italy", durationDays: 3 }],
      numberOfTravelers: 2,
      budget: "Moderate",
      interests: "sightseeing, local food, history",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "destinations",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Dream Trip</CardTitle>
        <CardDescription>
          Tell us your travel preferences, and we'll craft the perfect itinerary for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel>Destinations</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2 sm:gap-4 p-3 border rounded-lg bg-background/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                      <FormField
                        control={form.control}
                        name={`destinations.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(index !== 0 && "sr-only")}>Destination</FormLabel>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input placeholder="e.g., Paris, France" {...field} className="pl-10" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`destinations.${index}.durationDays`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(index !== 0 && "sr-only")}>Duration (days)</FormLabel>
                            <div className="relative">
                              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input type="number" placeholder="e.g., 7" {...field} className="pl-10" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-1 sm:mt-7 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      aria-label="Remove destination"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              {form.formState.errors.destinations?.root && <FormMessage>{form.formState.errors.destinations.root.message}</FormMessage>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => append({ name: "", durationDays: 3 })}
              >
                <PlusCircle className="h-4 w-4" />
                Add Destination
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-4">
               <FormField
                control={form.control}
                name="numberOfTravelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Travelers</FormLabel>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input type="number" placeholder="e.g., 2" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g., $2000, Luxury" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <div className="relative">
                      <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="e.g., Art, History, Hiking" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} size="lg" className="gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                Generate Itinerary
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
