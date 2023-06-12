import { AuthenticationError } from "@/errors/authentication-error"
import { User } from "@prisma/client"
import { Session } from "next-auth"

import db from "../db"

export async function getUser(session: Session): Promise<User> {
  const { user } = session

  if (!user) {
    throw new AuthenticationError("No user found")
  }

  const instance = await db.user.findUnique({
    where: {
      email: user.email,
    },
  })

  if (!instance) {
    throw new AuthenticationError("No user found")
  }

  return instance
}
