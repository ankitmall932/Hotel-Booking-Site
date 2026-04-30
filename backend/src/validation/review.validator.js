import { z } from "zod";

const reviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    comment: z.string().min(5, "Comment must be at least 5 characters").max(500, "Comment cannot be more than 500 characters"),
});

export default reviewSchema;