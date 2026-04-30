import { z } from "zod";

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email"),

    otp: z.string().length(6, "OTP must be 6 digits").optional(),

    password: z.string().min(6, "Password must be at least 6 chars").max(10, 'Password is not more than 10 chars').optional(),
});

export default resetPasswordSchema;