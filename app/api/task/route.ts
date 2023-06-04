import { NextResponse } from "next/server"
import { createTask, updateTask } from "@/backend/task"

import {
  TaskInput,
  UpdateTaskInput,
  taskInputSchema,
  updateTaskInputSchema,
} from "@/types/task"

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
