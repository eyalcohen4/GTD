import { z } from "zod"

export const kpiInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  projectId: z.string().optional(),
  userId: z.string(),
})

export const updateKpiInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  projectId: z.string().optional(),
})

export const kpiTargetInputSchema = z.object({
  value: z.number(),
  targetDate: z.string(),
  kpiId: z.string(),
})

export const kpiEntryInputSchema = z.object({
  value: z.number(),
  date: z.string(),
  kpiId: z.string(),
})

export type KpiInput = z.infer<typeof kpiInputSchema>
export type UpdateKpiInput = z.infer<typeof updateKpiInputSchema>
export type KpiTargetInput = z.infer<typeof kpiTargetInputSchema>
export type KpiEntryInput = z.infer<typeof kpiEntryInputSchema>

export const kpiTargetSchema = z.object({
  id: z.string(),
  value: z.number(),
  targetDate: z.string(),
  kpiId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const kpiEntrySchema = z.object({
  id: z.string(),
  value: z.number(),
  date: z.string(),
  kpiId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const kpiSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  userId: z.string(),
  projectId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  targets: z.array(kpiTargetSchema),
  entries: z.array(kpiEntrySchema),
})

export type Kpi = z.infer<typeof kpiSchema>
export type KpiTarget = z.infer<typeof kpiTargetSchema>
export type KpiEntry = z.infer<typeof kpiEntrySchema>
