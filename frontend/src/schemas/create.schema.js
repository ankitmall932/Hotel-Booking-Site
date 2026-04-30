import { z } from 'zod';

export const createSchema = z.object({
    name: z.string().min(3, 'Name is Required'),
    description: z.string().min(5, 'Please enter valid description'),
    price: z.coerce.number().min(1, 'Price is required'),
    amenities: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.literal('India'),
    images: z.any().refine((files) => files?.length >= 5, 'min 5').refine((files) => files?.length <= 5, 'max 5')
});

export const updateSchema = z.object({
    name: z.string().min(3, 'Name is Required'),
    description: z.string().min(5, 'Please enter valid description'),
    price: z.coerce.number().min(1, 'Price is required'),
    amenities: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.literal('India'),
    images: z.any().optional()
});