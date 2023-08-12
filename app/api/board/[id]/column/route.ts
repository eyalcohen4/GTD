import { NextResponse } from "next/server"
import {
  createColumn,
  deleteColumn,
  getColumns,
  updateColumn,
} from "@/backend/board"
import { getServerSession } from "next-auth"

import {
  ColumnInput,
  UpdateColumnInput,
  columnInputSchema,
  updateColumnInputSchema,
} from "@/types/board"

import { authOptions } from "../../../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return 401
    const body = (await request.json()) as { input: ColumnInput }
    if (!body || !body?.input) return 422
    const column = await createColumn(columnInputSchema.parse(body.input))
    return NextResponse.json({ column })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async (
  request: Request,
  {
    id: boardId,
  }: {
    id: string
  }
) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return 401
    if (!boardId) return 422
    const columns = await getColumns(boardId)
    return NextResponse.json({ columns })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: UpdateColumnInput
      id: string
    }
    if (!body || !body?.input || !body.id) return 422
    const updated = await updateColumn(
      body.id,
      // @ts-ignore
      updateColumnInputSchema.parse(body.input)
    )
    return NextResponse.json({ column: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const DELETE = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await request.json()
    if (!id) return 422
    const deleted = await deleteColumn(id)
    return NextResponse.json({ column: deleted })
  } catch (error) {
    console.log(error)
    return error
  }
}
