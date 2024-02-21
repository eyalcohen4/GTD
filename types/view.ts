import { z } from "zod"

const status = z.enum([
  "INBOX",
  "NEXT_ACTION",
  "WAITING_FOR",
  "SOMEDAY_MAYBE",
  "CALENDAR",
  "REFERENCE",
  "REVIEW",
  "ARCHIVE",
])

const taskFilterSchema = z.object({
  status: status.optional(),
  completed: z.boolean().optional(),
  dueDate: z
    .object({
      before: z.string().optional(),
      after: z.string().optional(),
    })
    .optional(),
})

const projectFilterSchema = z.object({
  status: status.optional(),
  completed: z.boolean().optional(),
  dueDate: z
    .object({
      before: z.string().optional(),
      after: z.string().optional(),
    })
    .optional(),
})

export const createViewInputSchema = z.object({
  userId: z.string(),
  name: z.string(),
  content: z.string().optional(),
  filter: z.union([taskFilterSchema, projectFilterSchema]),
  type: z.enum(["TASK", "PROJECT"]),
})

export const updateViewInputSchema = z.object({
  name: z.string().optional(),
  content: z.string().optional(),
  filter: z.any().optional(),
})

export type CreateViewInput = z.infer<typeof createViewInputSchema>
export type UpdateViewInput = z.infer<typeof updateViewInputSchema>

export const viewsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  filter: z.string(),
  type: z.enum(["TASK", "PROJECT"]),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Views = z.infer<typeof viewsSchema>
