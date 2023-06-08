import { NextRequest, NextResponse } from "next/server"
import { createTask, getTask, updateTask } from "@/backend/task"
import { getServerSession } from "next-auth"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession()

    if (!session) {
      return 401
    }

    if (!id) {
      return 422
    }

    const task = await getTask(id)
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
