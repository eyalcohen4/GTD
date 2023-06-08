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

      category: "INBOX",
    },
  })
}

export const updateTask = async (id: string, input: UpdateTaskInput) => {
  const { projectId, category, contexts, ...rest } = input

  try {
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
          connect: input?.contexts
            ? input.contexts?.map((contextId) => ({
                id: contextId,
              }))
            : undefined,
        },
      },
      include: {
        contexts: {
          select: {
            id: true,
          },
        },
      },
    })
    return instance
  } catch (error) {
    console.log(error)
  }
}

export const getTasks = async (
  userId: string,
  options?: {
    category?: CategoryEnum
  }
) => {
  return prisma.task.findMany({
    where: {
      user: {
        id: userId,
      },
      category: options?.category || undefined,
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
