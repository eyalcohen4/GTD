import { CategoryEnum, PrismaClient } from "@prisma/client"

import { TaskInput, UpdateTaskInput } from "@/types/task"
import prisma from "@/lib/db"

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

export const updateTask = async (id: string, input: UpdateTaskInput) => {
  const { projectId, category, contextIds, ...rest } = input

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      contexts: true,
    },
  })

  const contextIdsToDisconnect = task?.contexts
    ?.map((context) => context.id)
    .filter((contextId) => !contextIds?.includes(contextId))

  return prisma.task.update({
    where: {
      id,
    },
    data: {
      ...rest,
      category: category ? (category as CategoryEnum) : undefined,
      project: projectId
        ? {
            connect: {
              id: input.projectId,
            },
          }
        : undefined,
      contexts: {
        connect: input?.contextIds
          ? input.contextIds?.map((contextId) => ({
              id: contextId,
            }))
          : undefined,
        disconnect: contextIdsToDisconnect
          ? contextIdsToDisconnect?.map((contextId) => ({
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
    orderBy: {
      createdAt: "desc",
    },
    include: {
      contexts: true,
    },
  })
}
