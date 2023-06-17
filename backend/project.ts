import { PrismaClient } from "@prisma/client"

import { ProjectInput, UpdateProjectInput } from "@/types/project"
import { TaskInput } from "@/types/task"
import prisma from "@/lib/db"

const DEFAULT_FREQUENCY_DAYS = 7

export const createProject = async (input: ProjectInput) => {
  return prisma.project.create({
    data: {
      title: input.title,
      content: input.content || "",
      dueDate: input.dueDate,
      reviewFrequencyDays: DEFAULT_FREQUENCY_DAYS,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })
}

export const updateProject = async (id: string, input: UpdateProjectInput) => {
  return prisma.project.update({
    where: {
      id,
    },
    data: {
      title: input.title,
      content: input.content || "",
      dueDate: input.dueDate,
      reviewFrequencyDays: DEFAULT_FREQUENCY_DAYS,
      isDeleted: input.isDeleted,
      color: input.color,
      completed: input.completed,
      goalId: input.goal,
      status: input.status,
    },
  })
}

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      user: {
        id: userId,
      },
      isDeleted: false,
    },
  })
}

export const deleteProject = async (id: string) => {
  return prisma.project.update({
    where: {
      id,
    },
    data: {
      isDeleted: false,
    },
  })
}

export const getProject = async (id: string) => {
  return prisma.project.findUnique({
    where: {
      id,
    },
  })
}

export const getProjectTasksCount = async (id: string) => {
  const all = await prisma.task.count({
    where: { projectId: id },
  })

  const completed = await prisma.task.count({
    where: { projectId: id, completed: true },
  })

  const inbox = await prisma.task.count({
    where: { projectId: id, status: "INBOX" },
  })

  const waitingFor = await prisma.task.count({
    where: { projectId: id, status: "WAITING_FOR" },
  })

  const nextAction = await prisma.task.count({
    where: { projectId: id, status: "NEXT_ACTION" },
  })

  return {
    all: all,
    completed: completed,
    inbox: inbox,
    waitingFor: waitingFor,
    nextAction: nextAction,
  }
}
