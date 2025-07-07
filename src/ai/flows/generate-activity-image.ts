
'use server';
/**
 * @fileOverview Generates an image for a travel activity.
 *
 * - generateActivityImage - A function that generates an image based on an activity description.
 * - GenerateActivityImageInput - The input type for the function.
 * - GenerateActivityImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateActivityImageInputSchema = z.object({
  description: z.string().describe('The description of the travel activity.'),
  location: z.string().describe('The location (city, country) of the activity.'),
});
export type GenerateActivityImageInput = z.infer<typeof GenerateActivityImageInputSchema>;

const GenerateActivityImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateActivityImageOutput = z.infer<typeof GenerateActivityImageOutputSchema>;

export async function generateActivityImage(input: GenerateActivityImageInput): Promise<GenerateActivityImageOutput> {
  return generateActivityImageFlow(input);
}

const generateActivityImageFlow = ai.defineFlow(
  {
    name: 'generateActivityImageFlow',
    inputSchema: GenerateActivityImageInputSchema,
    outputSchema: GenerateActivityImageOutputSchema,
  },
  async ({ description, location }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A vibrant, high-quality, photorealistic image of: ${description}, in ${location}. The photo should be suitable for a travel blog, with a professional look. Do not include any people in the image.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
