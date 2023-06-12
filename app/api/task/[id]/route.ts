import { NextRequest, NextResponse } from "next/server"
import { createTask, getTask, updateTask } from "@/backend/task"
import { getServerSession } from "next-auth"

import { getSessionUser } from "@/lib/server/get-session-user"

import { authOptions } from "../../auth/[...nextauth]/route"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)

    if (!id) {
      return 422
    }

    const task = await getTask(id)

    if (task?.userId !== session?.user?.id) {
      return 401
    }

    const formatted = {
      ...task,
      contexts: task?.contexts.map((context) => context.id),
    }
    return NextResponse.json({ task: formatted })
  } catch (error) {
    console.log(error)
    return error
  }
}
