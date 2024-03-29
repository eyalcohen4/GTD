import { NextRequest, NextResponse } from "next/server"
import { createGoal, getGoal, getGoals, updateGoal } from "@/backend/goal"
import { getServerSession } from "next-auth"

import {
  GoalInput,
  UpdateGoalInput,
  goalInputSchema,
  updateGoalInputSchema,
} from "@/types/goal"

import { authOptions } from "../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return 401
    }

    const body = (await request.json()) as { input: GoalInput }

    if (!body || !body?.input) {
      return 422
    }

    const goal = await createGoal(goalInputSchema.parse(body.input))
    return NextResponse.json({ goal })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return 401
    }

    const goals = await getGoals(session?.user?.id)
    return NextResponse.json({ goals })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: UpdateGoalInput
      id: string
    }

    if (!body || !body?.input || !body.id) {
      return 422
    }

    const goal = await getGoal(body.id)

    if (goal?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateGoal(
      body.id,
      updateGoalInputSchema.parse(body.input)
    )
    return NextResponse.json({ goal: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
