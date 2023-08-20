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

export const updateProjectInputSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  status: z
    .enum(["NOT_STARTED", "IN_PROGRESS", "ON_HOLD", "COMPLETED"])
    .optional(),

  dueDate: z.string().optional(),
  color: z.string().optional(),
  goal: z.string().optional(),
  isDeleted: z.boolean().optional(),
  completed: z.boolean().optional(),
  reviewFrequencyDays: z.number().optional(),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  dueDate: z.string(),
  color: z.string().optional(),
  status: z.string().optional(),
  completed: z.boolean(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastReview: z.string().optional(),
  reviewFrequencyDays: z.number().optional(),
  goalId: z.string().optional(),
  progress: z.object({
    all: z.number(),
    completed: z.number(),
    inbox: z.number(),
    waitingFor: z.number(),
    nextAction: z.number(),
  }),
})

export type Project = z.infer<typeof projectSchema>
