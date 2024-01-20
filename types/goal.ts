import { z } from "zod"

export const goalInputSchema = z.object({
  title: z.string(),
  dueDate: z.string().optional(),
  motivation: z.string().optional(),
  userId: z.string(),
})

export const updateGoalInputSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  status: z
    .enum(["NOT_STARTED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "FAILED"])
    .optional(),
  dueDate: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  motivation: z.string().optional(),
  isDeleted: z.boolean().optional(),
})

export type GoalInput = z.infer<typeof goalInputSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalInputSchema>

export const goalSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  dueDate: z.string(),
  status: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "FAILED",
  ]),
  progress: z.number().min(0).max(100),
  motivation: z.string().optional(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tasksCount: z.object({
    all: z.number(),
    completed: z.number(),
    inbox: z.number(),
    waitingFor: z.number(),
    nextAction: z.number(),
  }),
  projectsCount: z.object({
    all: z.number(),
    completed: z.number(),
  }),
})

export const goalPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  dueDate: z.string(),
  status: z.enum([
    "NOT_STARTED",
    "IN_PROGRESS",
    "ON_HOLD",
    "COMPLETED",
    "FAILED",
  ]),
  progress: z.number().min(0).max(100),
  motivation: z.string().optional(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  projects: z.array(z.string()),
})

export type Goal = z.infer<typeof goalSchema>
export type GoalPreview = z.infer<typeof goalPreviewSchema>
