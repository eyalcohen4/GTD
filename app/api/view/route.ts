import { NextRequest, NextResponse } from "next/server"
import { createView, getView, getViews, updateView } from "@/backend/view"
import { getServerSession } from "next-auth"

import {
  CreateViewInput,
  UpdateViewInput,
  createViewInputSchema,
  updateViewInputSchema,
} from "@/types/view"

import { authOptions } from "../auth/[...nextauth]/route"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return 401
    }

    const body = (await request.json()) as { input: CreateViewInput }

    if (!body || !body?.input) {
      return 422
    }

    const view = await createView(createViewInputSchema.parse(body.input))
    return NextResponse.json({ view })
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

    const views = await getViews(session?.user?.id)
    return NextResponse.json({ views })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const PATCH = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as {
      input: UpdateViewInput
      id: string
    }

    if (!body || !body?.input || !body.id) {
      return 422
    }

    const view = await getView(body.id)

    if (view?.userId !== session?.user?.id) {
      return 403
    }

    const updated = await updateView(
      body.id,
      updateViewInputSchema.parse(body.input)
    )
    return NextResponse.json({ view: updated })
  } catch (error) {
    console.log(error)
    return error
  }
}
