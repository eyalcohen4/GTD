import { z } from "zod"

import { contextSchema } from "./context"

export const taskInputSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  userId: z.string(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.string().optional(),
  contexts: z.array(z.string()).optional(),
})

export const updateTaskInputSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  contexts: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  completed: z.boolean().optional(),
  status: z.string().optional(),
})

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>
export type TaskInput = z.infer<typeof taskInputSchema>

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  content: z.string().optional(),
  userId: z.string(),
  contexts: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.string().optional(),
  createdAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export const taskPreviewSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  userId: z.string(),
  contexts: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        color: z.string(),
      })
    )
    .optional()
    .nullable(),
  project: z
    .object({
      id: z.string(),
      title: z.string(),
      color: z.string(),
    })
    .optional()
    .nullable(),
  dueDate: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  createdAt: z.string(),
})

export type TaskPreview = z.infer<typeof taskPreviewSchema>
