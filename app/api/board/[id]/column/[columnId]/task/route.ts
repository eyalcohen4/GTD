import { NextResponse } from "next/server"
import {
  createColumn,
  createTaskColumn,
  deleteColumn,
  getColumn,
  getColumns,
  getColumnsTasks,
  updateColumn,
} from "@/backend/board"
import { getServerSession } from "next-auth"

import {
  ColumnInput,
  UpdateColumnInput,
  columnInputSchema,
  taskColumnInputSchema,
  updateColumnInputSchema,
} from "@/types/board"

import { authOptions } from "../../../../../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return 401
    const body = (await request.json()) as { input: ColumnInput }
    if (!body || !body?.input) return 422
    const columnTask = await createTaskColumn(
      taskColumnInputSchema.parse(body.input)
    )
    return NextResponse.json({ columnTask })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async (
  request: Request,
  params: {
    params: {
      id: string
      columnId: string
    }
  }
) => {
  try {
    const { columnId } = params.params
    const session = await getServerSession(authOptions)
    if (!session) return 401
    if (!columnId) return 422
    const column = await getColumn(columnId)
    if (column?.board?.userId !== session?.user?.id) return 401

    const tasks = await getColumnsTasks(columnId)
    return NextResponse.json({ tasks })
  } catch (error) {
    console.log(error)
    return error
  }
}
