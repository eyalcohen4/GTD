import { NextRequest, NextResponse } from "next/server"
import { createProject, getProjects } from "@/backend/project"
import { createTask } from "@/backend/task"
import { getServerSession } from "next-auth"

import { ProjectInput, projectInputSchema } from "@/types/project"
import { getSessionUser } from "@/lib/server/get-session-user"

import { authOptions } from "../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return 401
    }

    const body = (await request.json()) as { input: ProjectInput }

    if (!body || !body?.input) {
      return 422
    }

    const project = await createProject(projectInputSchema.parse(body.input))
    return NextResponse.json({ project })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)
    const projects = await getProjects(session?.user?.id)
    return NextResponse.json({ projects })
  } catch (error) {
    console.log(error)
    return error
  }
}
