import { NextRequest, NextResponse } from "next/server"
import { createGoal, getGoal, getGoals, updateGoal } from "@/backend/goal"
import { createKpi, getKpi, getKpis, updateKpi } from "@/backend/kpi"
import { getServerSession } from "next-auth"

import {
  GoalInput,
  UpdateGoalInput,
  goalInputSchema,
  updateGoalInputSchema,
} from "@/types/goal"
import {
  KpiInput,
  UpdateKpiInput,
  kpiInputSchema,
  updateKpiInputSchema,
} from "@/types/kpi"

import { authOptions } from "../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return 401
    }

    const body = (await request.json()) as { input: KpiInput }

    if (!body || !body?.input) {
      return 422
    }

    const kpi = await createKpi(kpiInputSchema.parse(body.input))
    return NextResponse.json({ kpi })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)
    const kpis = await getKpis(session?.user?.id)
    return NextResponse.json({ kpis })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: UpdateKpiInput
      id: string
    }

    if (!body || !body?.input || !body.id) {
      return 422
    }

    const goal = await getGoal(body.id)

    if (goal?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateKpi(
      body.id,
      updateKpiInputSchema.parse(body.input)
    )
    return NextResponse.json({ goal: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
