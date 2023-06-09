import { Status } from "@prisma/client"

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

      status: "INBOX",
    },
  })
}

export const updateTask = async (id: string, input: UpdateTaskInput) => {
  const { projectId, status, contexts, ...rest } = input

  try {
    const instance = await prisma.task.update({
      where: {
        id,
      },
      data: {
        ...rest,
        status: status ? (status as Status) : undefined,
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
    status?: Status
    projectId?: string
  }
) => {
  return prisma.task.findMany({
    where: {
      user: {
        id: userId,
      },
      status: options?.status || undefined,
      projectId: options?.projectId || undefined,
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
