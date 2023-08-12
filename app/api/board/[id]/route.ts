import { NextRequest, NextResponse } from "next/server"
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "@/backend/board"
import {
  createProject,
  getProject,
  getProjectTasksCount,
  getProjects,
  updateProject,
} from "@/backend/project"
import { createTask } from "@/backend/task"
import { getServerSession } from "next-auth"

import {
  BoardInput,
  UpdateBoardInput,
  boardInputSchema,
  updateBoardInputSchema,
} from "@/types/board"
import { ProjectInput, projectInputSchema } from "@/types/project"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)
    const board = await getBoard(id)

    if (session?.user?.id !== board?.userId) {
      return 401
    }

    return NextResponse.json({
      board,
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const DELETE = async (
  request: Request,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)
    if (!id) return 422
    const board = await getBoard(id)
    if (board?.userId !== session?.user?.id) return 403
    const deleted = await deleteBoard(id)
    return NextResponse.json({ board: deleted })
  } catch (error) {
    console.log(error)
    return error
  }
}
