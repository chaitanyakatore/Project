import { z } from "zod";

export const signupPostRequestBodySchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(3),
});

export const signinRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
