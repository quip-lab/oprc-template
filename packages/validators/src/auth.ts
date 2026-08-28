import { z } from "zod";

const credentialsSchema = z.object({
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signInSchema = credentialsSchema;

export const signUpSchema = credentialsSchema.extend({
    name: z
        .string()
        .trim()
        .min(1, "Enter your name.")
        .max(100, "Name must be 100 characters or fewer."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
