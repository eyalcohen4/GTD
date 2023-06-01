import { NextResponse } from "next/server"
import { createTask } from "@/backend/task"

import { TaskInput, taskInputSchema } from "@/types/task"

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
