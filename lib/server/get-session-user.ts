import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest } from "next/server"
import { AuthenticationError } from "@/errors/authentication-error"
import { User } from "@prisma/client"
import { Session, getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

import db from "../db"

export async function getSessionUser(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<User> {
  const session = await getServerSession(authOptions)
  console.log(session)

  if (!session || !session?.user?.email) {
    throw new AuthenticationError("No user found")
  }

  const instance = await db.user.findUnique({
    where: {
      email: session?.user.email,
    },
  })

  if (!instance) {
    throw new AuthenticationError("No user found")
  }

  return instance
}
