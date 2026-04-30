import { z } from 'zod';
import { locationData } from '../data/location.js';

const state = Object.keys(locationData);

export const listingSchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    price: z.coerce.number(),
    amenities: z.string().optional(),
    state: z.string(state),
    city: z.string(),
    country: z.literal('India')
});