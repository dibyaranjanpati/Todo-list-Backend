import { z } from "zod";

// for validating the signup request field
export const signupPostrequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(3),
});

// for validating the login request field
export const loginPostrequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
