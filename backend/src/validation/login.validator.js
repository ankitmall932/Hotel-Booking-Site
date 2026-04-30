import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 chars").max(10, 'Password is not more than 10 chars'),
});

export default loginSchema;