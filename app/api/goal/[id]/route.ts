import { NextRequest, NextResponse } from "next/server"
import {
  createGoal,
  getGoal,
  getGoalTasksCount,
  updateGoal,
} from "@/backend/goal"
import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)
    const goal = await getGoal(id)
    const progress = await getGoalTasksCount(id)

    if (session?.user?.id !== goal?.userId) {
      return 401
    }

    return NextResponse.json({
      goal: {
        ...goal,
        progress,
      },
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const DELETE = async (
  request: Request,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)

    const goal = await getGoal(id)

    if (goal?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateGoal(id, {
      isDeleted: true,
    })
    return NextResponse.json({ goal: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
