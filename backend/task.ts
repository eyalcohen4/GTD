import { Status } from "@prisma/client"

import { TaskInput, TaskPreview, UpdateTaskInput } from "@/types/task"
import prisma from "@/lib/db"

export const createTask = async (input: TaskInput) => {
  return prisma.task.create({
    data: {
      title: input.title,
      content: input.content || "",
      dueDate: input.dueDate,
      projectId: input.projectId || undefined,
      userId: input.userId,
      contexts: input.contexts
        ? {
            connect: input.contexts.map((contextId) => ({ id: contextId })),
          }
        : undefined,
      status: (input.status as Status) || "INBOX",
    },
  })
}

export const updateTask = async (id: string, input: UpdateTaskInput) => {
  const { projectId, status, contexts, ...rest } = input

  const getStatus = (): Status | undefined => {
    if (input.completed) {
      return "ARCHIVE"
    }

    return (status as Status) || undefined
  }

  try {
    const statusToSave = getStatus()
    const instance = await prisma.task.update({
      where: {
        id,
      },
      data: {
        ...rest,
        dueDate: input.dueDate === "" ? null : input.dueDate ?? undefined,
        status: statusToSave ? (statusToSave as Status) : undefined,
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

export const getTasksPreview = async (
  userId: string,
  options?: {
    search?: string
    from?: string
    to?: string
    hideCompleted?: boolean
    status?: Status
    projectId?: string
    contexts?: string[]
    statuses?: string[]
  }
): Promise<Array<TaskPreview>> => {
  // @ts-expect-error
  return prisma.task.findMany({
    where: {
      user: {
        id: userId,
      },
      title: options?.search
        ? {
            search: options.search,
          }
        : undefined,
      completed: options?.hideCompleted
        ? false
        : options?.status === "ARCHIVE" ||
          options?.statuses?.includes("ARCHIVE")
        ? true
        : undefined,
      projectId: options?.projectId || undefined,
      dueDate: {
        gte: options?.from || undefined,
        lte: options?.to || undefined,
      },

      OR:
        options?.statuses || options?.contexts
          ? [
              {
                status: options?.status
                  ? options.status
                  : options?.statuses
                  ? { in: options.statuses as Status[] }
                  : undefined,
              },
              {
                contexts: options?.contexts
                  ? {
                      some: {
                        id: {
                          in: options.contexts,
                        },
                      },
                    }
                  : undefined,
              },
            ]
          : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      contexts: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
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
