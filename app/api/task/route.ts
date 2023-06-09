import { NextRequest, NextResponse } from "next/server"
import { createTask, getTasks, updateTask } from "@/backend/task"
import { Status } from "@prisma/client"
import { getServerSession } from "next-auth"

import { Project } from "@/types/project"
import {
  TaskInput,
  UpdateTaskInput,
  taskInputSchema,
  updateTaskInputSchema,
} from "@/types/task"

export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession()

    if (!session) {
      return 401
    }

    const status = request.nextUrl.searchParams.get("status") as Status
    const projectId = request.nextUrl.searchParams.get("projectId") as string
    const tasks = await getTasks(session?.user?.id, {
      status,
      projectId,
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
