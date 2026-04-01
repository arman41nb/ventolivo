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

export const productAdminSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  tag: z.string().trim().min(1, "Tag is required").max(50),
  price: z.coerce.number().int().min(0, "Price must be zero or greater"),
  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex code"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
  ingredients: z.string().optional().default(""),
  weight: z.string().trim().max(30).optional().default(""),
  featured: z.boolean().optional().default(false),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  next: z.string().optional().default(""),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type ProductAdminForm = z.infer<typeof productAdminSchema>;
export type AdminLoginForm = z.infer<typeof adminLoginSchema>;
