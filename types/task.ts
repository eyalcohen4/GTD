import { z } from "zod"

export const taskInputSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  userId: z.string(),
  contextIds: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
})

export type TaskInput = z.infer<typeof taskInputSchema>

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  userId: z.string(),
  contexts: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
