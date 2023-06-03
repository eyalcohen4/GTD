import { NextResponse } from "next/server"
import { createContext, getContexts } from "@/backend/context"
import { getServerSession } from "next-auth"

import { ContextInput, contextInputSchema } from "@/types/context"

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession()

    if (!session) {
      return 401
    }

    const body = (await request.json()) as { input: ContextInput }

    if (!body || !body?.input) {
      return 422
    }

    const context = await createContext(contextInputSchema.parse(body.input))
    return NextResponse.json({ context })
  } catch (error) {
    console.log(error)
    return error
  }
}

export const GET = async (request: Request) => {
  try {
    const session = await getServerSession()

    if (!session) {
      return 401
    }

    const contexts = await getContexts(session?.user?.id)
    return NextResponse.json({ contexts })
  } catch (error) {
    console.log(error)
    return error
  }
}
