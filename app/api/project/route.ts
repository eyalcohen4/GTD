import { NextRequest, NextResponse } from "next/server"
import {
  createProject,
  getProject,
  getProjects,
  updateProject,
} from "@/backend/project"
import { getServerSession } from "next-auth"

import {
  ProjectInput,
  UpdateProjectInput,
  projectInputSchema,
  updateProjectInputSchema,
} from "@/types/project"

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

    if (!session) {
      return 401
    }

    const projects = await getProjects(session?.user?.id)
    return NextResponse.json({ projects })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: UpdateProjectInput
      id: string
    }

    if (!body || !body?.input || !body.id) {
      return 422
    }

    const project = await getProject(body.id)

    if (project?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateProject(
      body.id,
      updateProjectInputSchema.parse(body.input)
    )
    return NextResponse.json({ project: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
