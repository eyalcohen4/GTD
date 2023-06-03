import { z } from "zod"

export const projectInputSchema = z.object({
  title: z.string(),
  content: z.string(),
  dueDate: z.string().optional(),
  color: z.string(),
  completed: z.boolean().optional(),
  userId: z.string(),
  reviewFrequencyDays: z.number().optional(),
})

export type ProjectInput = z.infer<typeof projectInputSchema>

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  dueDate: z.date(),
  color: z.string().optional(),
  completed: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastReview: z.date().optional(),
  reviewFrequencyDays: z.number().optional(),
})

export type Project = z.infer<typeof projectSchema>
