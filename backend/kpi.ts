import { GoalInput, UpdateGoalInput } from "@/types/goal"
import { Kpi, KpiEntryInput, KpiInput, KpiTargetInput } from "@/types/kpi"
import prisma from "@/lib/db"

export const createKpi = async (input: KpiInput) => {
  return prisma.kpi.create({
    data: {
      title: input.title,
      projectId: input.projectId || undefined,
      userId: input.userId,
    },
  })
}

export const createKpiEntry = async (input: KpiEntryInput) => {
  return prisma.kpiEntry.create({
    data: {
      value: input.value,
      date: input.date || new Date().toISOString(),
      kpiId: input.kpiId,
    },
  })
}

export const createKpiTarget = async (input: KpiTargetInput) => {
  return prisma.kpiTarget.create({
    data: {
      value: input.value,
      targetDate: input.targetDate,
      kpiId: input.kpiId,
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

export const getKpis = async (userId: string) => {
  return prisma.kpi.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    include: {
      targets: true,
      entries: true,
      project: {
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
