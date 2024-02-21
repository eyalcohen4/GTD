import { GoalInput, UpdateGoalInput } from "@/types/goal"
import {
  Kpi,
  KpiEntryInput,
  KpiInput,
  KpiTargetInput,
  UpdateKpiInput,
} from "@/types/kpi"
import prisma from "@/lib/db"

export const createKpi = async (input: KpiInput) => {
  const target = {
    value: parseFloat(input.target?.value || ""),
    targetDate: input.target?.targetDate || undefined,
  }

  console.log(target)

  return prisma.kpi.create({
    data: {
      title: input.title,
      goalId: input.goalId || undefined,
      userId: input.userId,
      targets: {
        create: target,
      },
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

export const updateKpi = async (id: string, input: UpdateKpiInput) => {
  return prisma.kpi.update({
    where: {
      id,
    },
    data: {
      title: input.title || undefined,
      isDeleted: input.isDeleted || false,
    },
  })
}

export const getKpis = async (userId: string) => {
  return prisma.kpi.findMany({
    where: {
      user: {
        id: userId,
      },
      isDeleted: false,
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

export const getKpi = async (id: string) => {
  return prisma.kpi.findUnique({
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
