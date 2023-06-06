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

  const instance = await prisma.task.update({
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
      },
    },
    include: {
      contexts: true,
    },
  })

  if (instance.completed) {
    await prisma.task.update({
      where: {
        id,
      },
      data: {
        category: "ARCHIVE",
        completedAt: new Date(),
      },
    })
  }

  return instance
}

export const getTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      contexts: {
        select: {
          id: true,
        },
      },
    },
  })
}

export const getTask = async (id: string) => {
  return prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      contexts: {
        select: {
          id: true,
        },
      },
    },
  })
}
