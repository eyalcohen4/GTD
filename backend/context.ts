import { PrismaClient } from "@prisma/client"

import { ContextInput } from "@/types/context"
import { ProjectInput } from "@/types/project"
import prisma from "@/lib/db"

export const createContext = async (input: ContextInput) => {
  return prisma.context.create({
    data: {
      title: input.title,
      color: input.color,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })
}

export const getContexts = async (userId: string) => {
  return prisma.context.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  })
}
