import { NextRequest, NextResponse } from "next/server"
import { createTask, getTasksPreview, updateTask } from "@/backend/task"
import { Status } from "@prisma/client"
import { getServerSession } from "next-auth/next"

import {
  TaskInput,
  UpdateTaskInput,
  taskInputSchema,
  updateTaskInputSchema,
} from "@/types/task"
import { getUser } from "@/lib/server/get-user"

export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession()

    if (!session || !session?.user?.email) {
      return 401
    }

    const user = await getUser(session)

    const status = request.nextUrl.searchParams.get("status") as Status
    const projectId = request.nextUrl.searchParams.get("projectId") as string
    const contextId = request.nextUrl.searchParams.get("contextId") as string

    const tasks = await getTasksPreview(user?.id, {
      status,
      projectId,
      contextId,
    })
    return NextResponse.json({ tasks })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as { input: TaskInput }

    if (!body || !body?.input) {
      return 422
    }

    const task = await createTask(taskInputSchema.parse(body.input))
    return NextResponse.json({ task })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const body = (await request.json()) as {
      input: UpdateTaskInput
      id: string
    }

    if (!body || !body?.input || !body.id) {
      return 422
    }

    const task = await updateTask(
      body.id,
      updateTaskInputSchema.parse(body.input)
    )
    return NextResponse.json({ task })
  } catch (error) {
    console.log(error)
    return error
  }
}
