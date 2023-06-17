import { ContextInput, UpdateContextInput } from "@/types/context"
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

export const getContext = async (id: string) => {
  return prisma.context.findUnique({
    where: {
      id,
    },
  })
}

export const updateContext = async (id: string, data: UpdateContextInput) => {
  return prisma.context.update({
    where: {
      id,
    },
    data,
  })
}
