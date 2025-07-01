import { z } from "zod";

import { VALIDATION_MESSAGES } from "./form-options";

// =============================================================================
// FORM VALIDATION SCHEMA
// =============================================================================

export const demoFormSchema = z
  .object({
    // Personal Information
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),

    email: z.string().email(VALIDATION_MESSAGES.EMAIL_INVALID),

    // Authentication
    password: z
      .string()
      .min(8, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        VALIDATION_MESSAGES.PASSWORD_COMPLEXITY
      ),

    confirmPassword: z.string(),

    // Demographics
    age: z
      .number()
      .min(18, VALIDATION_MESSAGES.AGE_MIN)
      .max(100, VALIDATION_MESSAGES.AGE_MAX),

    birthDate: z.string().min(1, "Birth date is required"),

    // Contact Information
    phone: z
      .string()
      .regex(/^\+?[\d\s-()]+$/, VALIDATION_MESSAGES.PHONE_INVALID),

    website: z
      .string()
      .url(VALIDATION_MESSAGES.URL_INVALID)
      .optional()
      .or(z.literal("")),

    // Professional Information
    salary: z.number().positive(VALIDATION_MESSAGES.SALARY_POSITIVE),

    bio: z.string().max(500, VALIDATION_MESSAGES.BIO_MAX_LENGTH).optional(),

    // Location and Skills
    country: z.string().min(1, "Please select a country"),

    skills: z.string().min(1, "Please select at least one skill"),

    experience: z.enum(["junior", "mid", "senior", "lead"]),

    availability: z.string().min(1, "Please select availability"),

    // Technical Skills (Multi-select)
    programmingLanguages: z
      .array(z.string())
      .min(1, VALIDATION_MESSAGES.MIN_SELECTIONS(1, "programming language")),

    frameworks: z.array(z.string()).optional(),

    interests: z
      .array(z.string())
      .min(2, VALIDATION_MESSAGES.MIN_SELECTIONS(2, "interest")),

    // Agreement and Preferences
    newsletter: z.boolean(),

    terms: z.boolean().refine((val) => val, VALIDATION_MESSAGES.TERMS_REQUIRED),

    // File Uploads
    avatar: z.any().optional(),
    resume: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
    path: ["confirmPassword"],
  });

export type DemoFormData = z.infer<typeof demoFormSchema>;
