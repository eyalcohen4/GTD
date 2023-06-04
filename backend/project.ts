import { PrismaClient } from "@prisma/client"

import { ProjectInput } from "@/types/project"
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

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  })
}
