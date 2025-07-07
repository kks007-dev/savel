import type { TravelItineraryOutput, TravelItineraryInput } from '@/ai/flows/generate-travel-itinerary';
import type { RegenerateActivityOutput } from '@/ai/flows/regenerate-activity';

export type Itinerary = TravelItineraryOutput;
export type ItineraryInput = TravelItineraryInput;
export type Activity = Itinerary['dailyItineraries'][0]['activities'][0] & { imageUrl?: string };
export type HotelSuggestion = Itinerary['hotelSuggestions'][0];
export type TransportSuggestion = Itinerary['transportSuggestions'][0];
export type RegeneratedActivity = RegenerateActivityOutput;
