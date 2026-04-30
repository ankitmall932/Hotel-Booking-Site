import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(3, "Name is required & Must be at least 5 char"),

    email: z.string().email("Invalid email"),

    password: z.string().min(6, "Password must be at least 6 chars").max(10, 'Password is not more than 10 chars'),

    role: z.enum([ 'customer', 'owner' ]).optional(),

    currentRole: z.string([ 'customer', 'owner' ]).optional(),

    isVerified: z.boolean().optional(),

    otp: z.string().length(6, "OTP must be 6 digits").optional(),

    otpExpired: z.coerce.date().optional(), // string ko date me convert karega
});

export default registerSchema;
