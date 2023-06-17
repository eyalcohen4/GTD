import { GoalInput, UpdateGoalInput } from "@/types/goal"
import prisma from "@/lib/db"

export const createGoal = async (input: GoalInput) => {
  return prisma.goal.create({
    data: {
      title: input.title,
      content: "",
      dueDate: input.dueDate,
      status: "IN_PROGRESS",
      progress: 0,
      user: {
        connect: {
          id: input.userId,
        },
      },
      motivation: input.motivation || "",
    },
  })
}

export const updateGoal = async (id: string, input: UpdateGoalInput) => {
  return prisma.goal.update({
    where: {
      id,
    },
    data: {
      title: input.title,
      content: input.content || "",
      dueDate: input.dueDate,
      status: input.status,
      progress: input.progress,
      motivation: input.motivation,
      isDeleted: input.isDeleted,
    },
  })
}

export const getGoals = async (userId: string) => {
  return prisma.goal.findMany({
    where: {
      user: {
        id: userId,
      },
      isDeleted: false,
    },
    include: {
      projects: {
        select: {
          id: true,
        },
      },
    },
  })
}

export const deleteGoal = async (id: string) => {
  return prisma.goal.delete({
    where: {
      id,
    },
  })
}

export const getGoal = async (id: string) => {
  return prisma.goal.findUnique({
    where: {
      id,
    },
  })
}

export const getGoalProjectsCount = async (id: string) => {
  const all = await prisma.project.count({
    where: { goalId: id },
  })

  const completed = await prisma.project.count({
    where: { goalId: id, completed: true },
  })

  return {
    all: all,
    completed: completed,
  }
}

export const getGoalTasksCount = async (id: string) => {
  const all = await prisma.task.count({
    where: { goalId: id },
  })

  const completed = await prisma.task.count({
    where: { goalId: id, completed: true },
  })

  const inbox = await prisma.task.count({
    where: { goalId: id, status: "INBOX" },
  })

  const waitingFor = await prisma.task.count({
    where: { goalId: id, status: "WAITING_FOR" },
  })

  const nextAction = await prisma.task.count({
    where: { goalId: id, status: "NEXT_ACTION" },
  })

  return {
    all: all,
    completed: completed,
    inbox: inbox,
    waitingFor: waitingFor,
    nextAction: nextAction,
  }
}
