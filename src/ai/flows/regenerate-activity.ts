// Regenerate a specific activity within the itinerary.

'use server';

/**
 * @fileOverview A flow for regenerating a specific activity within a travel itinerary.
 *
 * - regenerateActivity - A function that handles the regeneration of an activity.
 * - RegenerateActivityInput - The input type for the regenerateActivity function.
 * - RegenerateActivityOutput - The return type for the regenerateActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateActivityInputSchema = z.object({
  location: z.string().describe('The location for which to regenerate the activity.'),
  activity: z.string().describe('The activity to regenerate.'),
  originalItinerary: z.string().describe('The original itinerary.'),
  budget: z.string().describe('The budget for the trip.'),
  interests: z.string().describe('The interests of the traveler.'),
});
export type RegenerateActivityInput = z.infer<typeof RegenerateActivityInputSchema>;

const RegenerateActivityOutputSchema = z.object({
  newActivity: z.string().describe('The newly generated activity.'),
  reasoning: z.string().describe('Reasoning for picking this new activity'),
});
export type RegenerateActivityOutput = z.infer<typeof RegenerateActivityOutputSchema>;

export async function regenerateActivity(input: RegenerateActivityInput): Promise<RegenerateActivityOutput> {
  return regenerateActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'regenerateActivityPrompt',
  input: {
    schema: RegenerateActivityInputSchema,
  },
  output: {
    schema: RegenerateActivityOutputSchema,
  },
  prompt: `You are a travel expert tasked with improving travel itineraries.

  A user wants to regenerate an activity in their itinerary.

  Here is the location: {{location}}
  Here is the activity they want to replace: {{activity}}
  Here is their original itinerary: {{originalItinerary}}
  Here is their budget: {{budget}}
  Here are some of their interests: {{interests}}

  Suggest a new activity that would be a good replacement, and explain your reasoning.
  Make sure the new activity is appropriate for the location, budget, and interests of the traveler.
  Format the response as JSON: {"newActivity": "your activity", "reasoning": "your reasoning"}`,
});

const regenerateActivityFlow = ai.defineFlow(
  {
    name: 'regenerateActivityFlow',
    inputSchema: RegenerateActivityInputSchema,
    outputSchema: RegenerateActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
