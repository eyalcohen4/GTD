import { PrismaClient } from "@prisma/client"

import { TaskInput } from "@/types/task"

const prisma = new PrismaClient()

export const createTask = async (input: TaskInput) => {
  return prisma.task.create({
    data: {
      title: input.title,
      content: input.content || "",
      dueDate: input.dueDate,
      user: {
        connect: {
          id: input.userId,
        },
      },
      project: input.projectId
        ? {
            connect: {
              id: input.projectId,
            },
          }
        : undefined,
      category: "INBOX",
      contexts: {
        connect: input?.contextIds
          ? input.contextIds?.map((contextId) => ({
              id: contextId,
            }))
          : undefined,
      },
    },
  })
}

export const getInbox = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      user: {
        id: userId,
      },
      category: "INBOX",
    },
  })
}
