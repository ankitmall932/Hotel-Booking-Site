import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3, 'Name Required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Min char 6').max(20, 'Max char 20'),
    confirmPassword: z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: [ 'confirmPassword' ]
    });


export const verifyOtp = z.object({
    otp: z.string().length(6, 'Otp must be 6 digit')
});

export const loginUser = z.object({
    email: z.string().email('Invalid Email'),
    password: z.string().min(6, 'Min Char 6').max(20, 'Max Char 20')
});

export const resetSchema = z.object({
    password: z.string().min(6, 'min 6 char is required').max(20, 'less then 20 char'),
    confirmPassword: z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: [ 'confirmPassword' ]
    });

export const forgetSchema = z.object({
    email: z.string().email('Invalid Email'),
    password: z.string().min(6, 'min 6 char is required').max(20, 'less then 20 char'),
    confirmPassword: z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: [ 'confirmPassword' ]
    });