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

export type Context = z.infer<typeof contextSchema>
