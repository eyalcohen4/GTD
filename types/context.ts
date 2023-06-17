import { z } from "zod"

export const contextInputSchema = z.object({
  title: z.string(),
  color: z.string().optional(),
  userId: z.string(),
})

export type ContextInput = z.infer<typeof contextInputSchema>

export const contextSchema = z.object({
  id: z.string(),
  title: z.string(),
  color: z.string().optional(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const updateContextInputSchema = z.object({
  title: z.string().optional(),
  color: z.string().optional(),
})

export type UpdateContextInput = z.infer<typeof updateContextInputSchema>
export type Context = z.infer<typeof contextSchema>
