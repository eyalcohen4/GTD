import { NextResponse } from "next/server"
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "@/backend/board"
import { getServerSession } from "next-auth"

import {
  BoardInput,
  UpdateBoardInput,
  boardInputSchema,
  updateBoardInputSchema,
} from "@/types/board"

import { authOptions } from "../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return 401
    const body = (await request.json()) as { input: BoardInput }
    if (!body || !body?.input) return 422
    const board = await createBoard(boardInputSchema.parse(body.input))
    return NextResponse.json({ board })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return 401
    const boards = await getBoards(session?.user?.id)
    return NextResponse.json({ boards })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: UpdateBoardInput
      id: string
    }
    if (!body || !body?.input || !body.id) return 422
    const board = await getBoard(body.id)
    if (board?.userId !== session?.user?.id) return 403
    const updated = await updateBoard(
      body.id,
      // @ts-ignore
      updateBoardInputSchema.parse(body.input)
    )
    return NextResponse.json({ board: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
