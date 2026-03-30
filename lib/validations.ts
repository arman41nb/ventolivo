import { z } from "zod";

export const productQuerySchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
});

export const productFilterSchema = z.object({
  tag: z.string().min(1).max(50).optional(),
  featured: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().regex(/^\+?[\d\s-]{7,20}$/, "Invalid phone number").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  productId: z.number().int().positive().optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
