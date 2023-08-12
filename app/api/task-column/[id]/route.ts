import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest, NextResponse } from "next/server"
import { getTaskColumn, updateTaskColumn } from "@/backend/board"
import { createTask, getTasksPreview, updateTask } from "@/backend/task"
import { Status } from "@prisma/client"
import { getServerSession } from "next-auth/next"

import { TaskColumnInput, taskColumnInputSchema } from "@/types/board"
import {
  TaskInput,
  UpdateTaskInput,
  taskInputSchema,
  updateTaskInputSchema,
} from "@/types/task"
import { getSessionUser } from "@/lib/server/get-session-user"

import { authOptions } from "../../auth/[...nextauth]/route"

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: TaskColumnInput
      id: string
    }

    if (!body || !body?.input || !body.id) {
      return 422
    }

    const task = await getTaskColumn(body.id)

    if (task?.column?.board?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateTaskColumn(
      body.id,
      taskColumnInputSchema.parse(body.input)
    )
    return NextResponse.json({ task: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
