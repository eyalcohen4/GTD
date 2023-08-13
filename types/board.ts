import { z } from "zod"

export const boardInputSchema = z.object({
  title: z.string(),
  userId: z.string(),
})

export type BoardInput = z.infer<typeof boardInputSchema>

export const boardSchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Board = z.infer<typeof boardSchema>

export const columnInputSchema = z.object({
  title: z.string(),
  boardId: z.string(),
  order: z.number().optional(),
})

export const updateBoardInputSchema = z.object({
  title: z.string().optional(),
})

export type UpdateBoardInput = z.infer<typeof updateBoardInputSchema>

export type ColumnInput = z.infer<typeof columnInputSchema>

export const columnSchema = z.object({
  id: z.string(),
  title: z.string(),
  boardId: z.string(),
  order: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Column = z.infer<typeof columnSchema>

export const taskColumnInputSchema = z.object({
  taskId: z.string().optional(),
  columnId: z.string(),
  order: z.number().optional(),
})

export type TaskColumnInput = z.infer<typeof taskColumnInputSchema>

export const taskColumnSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  columnId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TaskColumn = z.infer<typeof taskColumnSchema>

export const updateColumnInputSchema = z.object({
  title: z.string().optional(),
  order: z.number().optional(),
})

export type UpdateColumnInput = z.infer<typeof updateColumnInputSchema>
