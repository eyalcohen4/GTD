import { NextResponse } from "next/server"
import { getInbox } from "@/backend/task"
import { getServerSession } from "next-auth"

export const GET = async (request: Request) => {
  try {
    const session = await getServerSession()
    const inbox = await getInbox(session?.user?.id)
    return NextResponse.json({ inbox })
  } catch (error) {
    console.log(error)
    return error
  }
}
