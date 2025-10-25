import { z } from 'zod'

// Define enums to match Prisma schema
export const SexEnum = z.enum(['male', 'female', 'other', 'prefer_not_to_say'])
export const EyeColorEnum = z.enum(['Brown', 'Blue', 'Green', 'Grey', 'Hazel'])
export const PermitTypeEnum = z.enum(['regular', 'senior', 'junior'])
export const StateEnum = z.enum([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
])

export const permitApplicationSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  heightFeet: z.number()
    .min(1, 'Feet must be at least 1')
    .max(7, 'Feet must be 7 or less')
    .int('Feet must be a whole number'),
  heightInches: z.number()
    .min(0, 'Inches must be 0 or more')
    .max(12, 'Inches must be 12 or less')
    .int('Inches must be a whole number'),
  dateOfBirthMonth: z.number()
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12')
    .int('Month must be a whole number'),
  dateOfBirthDay: z.number()
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31')
    .int('Day must be a whole number'),
  dateOfBirthYear: z.number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .int('Year must be a whole number'),
  sex: SexEnum,
  eyeColor: EyeColorEnum,
  addressLine1: z.string()
    .min(1, 'Address line 1 is required')
    .max(100, 'Address line 1 must be less than 100 characters'),
  addressLine2: z.string()
    .max(100, 'Address line 2 must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  town: z.string()
    .min(1, 'Town is required')
    .max(50, 'Town must be less than 50 characters'),
  state: StateEnum,
  zipCode: z.string()
    .min(1, 'ZIP code is required')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  permitType: PermitTypeEnum,
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms of service',
  }),
  communicationsOptIn: z.boolean(),
})

// Admin validation schemas
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be less than 50 characters'),
  password: z.string().min(1, 'Password is required'),
})

export const adminCreateSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be less than 50 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  email: z.string().email('Please enter a valid email address').optional(),
  firstName: z.string().max(50, 'First name must be less than 50 characters').optional(),
  lastName: z.string().max(50, 'Last name must be less than 50 characters').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']).default('ADMIN'),
})

// API validation schema (expects combined height field)
export const permitApplicationApiSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  height: z.string()
    .min(1, 'Height is required')
    .max(10, 'Height must be less than 10 characters'),
  dateOfBirthMonth: z.number()
    .min(1, 'Month must be between 1 and 12')
    .max(12, 'Month must be between 1 and 12')
    .int('Month must be a whole number'),
  dateOfBirthDay: z.number()
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31')
    .int('Day must be a whole number'),
  dateOfBirthYear: z.number()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .int('Year must be a whole number'),
  sex: SexEnum,
  eyeColor: EyeColorEnum,
  addressLine1: z.string()
    .min(1, 'Address line 1 is required')
    .max(100, 'Address line 1 must be less than 100 characters'),
  addressLine2: z.string()
    .max(100, 'Address line 2 must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  town: z.string()
    .min(1, 'Town is required')
    .max(50, 'Town must be less than 50 characters'),
  state: StateEnum,
  zipCode: z.string()
    .min(1, 'ZIP code is required')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number'),
  permitType: PermitTypeEnum,
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms of service',
  }),
  communicationsOptIn: z.boolean(),
})

export type PermitApplicationData = z.infer<typeof permitApplicationSchema>
export type PermitApplicationApiData = z.infer<typeof permitApplicationApiSchema>
export type AdminLoginData = z.infer<typeof adminLoginSchema>
export type AdminCreateData = z.infer<typeof adminCreateSchema>
