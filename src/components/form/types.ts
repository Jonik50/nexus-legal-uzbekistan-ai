
import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  company_size: z.string().min(1, "Please select a company size"),
  language: z.string().min(1, "Please select a language"),
});

export type FormValues = z.infer<typeof formSchema>;
