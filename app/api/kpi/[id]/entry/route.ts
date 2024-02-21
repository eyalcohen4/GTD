import { NextRequest, NextResponse } from "next/server"
import { createGoal, getGoal, getGoals, updateGoal } from "@/backend/goal"
import {
  createKpi,
  createKpiEntry,
  getKpi,
  getKpis,
  updateKpi,
} from "@/backend/kpi"
import { getServerSession } from "next-auth"

import {
  KpiEntry,
  KpiInput,
  kpiEntryInputSchema,
  kpiInputSchema,
} from "@/types/kpi"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return 401
    }

    const body = (await request.json()) as { input: KpiEntry }

    if (!body || !body?.input) {
      return 422
    }

    const kpi = await createKpiEntry(kpiEntryInputSchema.parse(body.input))
    return NextResponse.json({ kpi })
  } catch (error) {
    console.log(error)
    return error
  }
}
