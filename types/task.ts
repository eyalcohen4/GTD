import { z } from "zod"

export const taskInputSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  userId: z.string(),
  contextIds: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
})

export const updateTaskInputSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  contextIds: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
})

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>
export type TaskInput = z.infer<typeof taskInputSchema>

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  userId: z.string(),
  contexts: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string(),
      })
    )
    .optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
