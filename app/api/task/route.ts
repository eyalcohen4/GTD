import { NextApiRequest, NextApiResponse } from "next"
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
import { getSessionUser } from "@/lib/server/get-session-user"

import { authOptions } from "../auth/[...nextauth]/route"

export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    const from = request.nextUrl.searchParams.get("from") as string
    const to = request.nextUrl.searchParams.get("to") as string
    const completed = request.nextUrl.searchParams.get("completed") as string
    const status = request.nextUrl.searchParams.get("status") as Status
    const projectId = request.nextUrl.searchParams.get("projectId") as string
    const statuses = request.nextUrl.searchParams.get("statuses") as string
    const contexts = request.nextUrl.searchParams.get("contexts") as string

    const tasks = await getTasksPreview(session?.user?.id, {
      status,
      projectId,
      from: from || undefined,
      to: to || undefined,
      hideCompleted: completed === "false",
      contexts: contexts ? contexts.split(",") : undefined,
      statuses: statuses ? statuses.split(",") : undefined,
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
