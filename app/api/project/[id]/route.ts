import { NextRequest, NextResponse } from "next/server"
import {
  createProject,
  getProject,
  getProjectTasksCount,
  getProjects,
} from "@/backend/project"
import { createTask } from "@/backend/task"
import { getServerSession } from "next-auth"

import { ProjectInput, projectInputSchema } from "@/types/project"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const GET = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    const session = await getServerSession(authOptions)
    const project = await getProject(id)
    const progress = await getProjectTasksCount(id)

    if (session?.user?.id !== project?.userId) {
      return 401
    }

    return NextResponse.json({
      project: {
        ...project,
        progress,
      },
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
