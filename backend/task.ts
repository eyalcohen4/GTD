import { Status } from "@prisma/client"
import OpenAI from "openai"

import { TaskInput, TaskPreview, UpdateTaskInput } from "@/types/task"
import prisma from "@/lib/db"

import { getContexts } from "./context"
import { getGoals } from "./goal"
import { getProjects } from "./project"

const openai = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || "") as string,
})

const buildFeedbackPrompt = ({
  user,
  goals,
  projects,
  contexts,
  task,
}: {
  user: { name: string }
  goals: { title: string; id: string }[]
  projects: { title: string; goalId?: string | null; id: string }[]
  contexts: { title: string }[]
  task: {
    title: string
    projectId: string
    contextsIds: string[]
    dueDate: string
    status: string
  }
}) => `
      You are an assistant to our application user. He's a busy person with a busy job.
      Your role - Getting Things Done (GTD) Assistant - is to help him acheive his goals and be happy.

      I'm sending you now a list of his goals, projects, contexts, and a new task.
      Your job is to process a new task (an inbox input) from a user based on the Getting Things Done process flow method.

      For each task, provide the answers:
      - What is this?
      - Is it actionalbe?
        - If yes, is it multi-step?
          - If so, suggest a project name and the next action.
        - If one-step, what is the actual action?
          - Can it be done in 2 minutes?
            - If yes, do it now.
            - If no, can it be delegated or deferd?
              - If defer - Either suggest a date or attach a project and status.
              - If delegate - Either suggest a person or attach a suggestion on next action.
        - If not actionable, is it reference material?
          - If yes, attach a project and status.
          - If no, is it trash?

      Provide back a short response for this task. the response will be shown to the user in the app.
      It should be 20-30 words top.
      Remember, The goal is that the user have only 4,000 weeks to live. every day is cruical and should be lived like there's no tomorrow.

      Goals: ${goals
        ?.map(({ title, id }) => `title: ${title}; id: ${id}`)
        .join(",")}
      Projects: ${projects
        ?.map(
          ({ title, goalId, id }) =>
            `title: ${title}; id: ${id}; goalId: ${goalId ?? ""}`
        )
        .join(",")}
      
      Contexts: ${contexts?.map(({ title }) => title).join(", ")}

      ----- 
      Here's the task:
      ${JSON.stringify(task)}

      Thank you!
    `

export const createTask = async (input: TaskInput) => {
  const instance = await prisma.task.create({
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

  const goals = await getGoals(input.userId)
  const projects = await getProjects(input.userId)
  const contexts = await getContexts(input.userId)

  const aiFeedback = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
          You are the getting things done god. Your job is an assistant to users of my app, called Current. The app help people stay present in their daily life while acheiving their goals 
          by automatically prioritzie their tasks and projects.
          This is the app pricnipels: 
          - It helps live like there’s no tomorrow. this means that priorities are matter the most.
          - What tasks you complete are way more important than how many you did. 
          - You don’t need to spend your time organizing your mind. 
          - Your mind should be free to solve complex problems, the one’s you’ve added as goals, and projects, and tasks.
          - Your time is best spent getting things done.
          - AI can release us from constantly managing our time.
          - If we be clear about our goals, acheving them should be our main focus, not moving tasks around.
          - Don’t get your life together. Just live your life alongside your work.
          - Stop trying to get more done, work on what important
          - Stop trying to control your time. Start live it and be present

            Your goal is help the user process his inbox automatically in the getting things done method and flow. 
            You must return a single sentence of 100 words top.
            It will be shared with a user through the app.
        `,
      },
      {
        role: "user",
        content: buildFeedbackPrompt({
          goals,
          projects,
          contexts,
          // @ts-ignore
          task: instance,
        }),
      },
    ],
    model: "gpt-4",
  })
  console.log(aiFeedback.choices?.[0]?.message.content || "")
  return instance
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
        completedAt: input.completed ? new Date() : undefined,
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
    completedFrom?: string
    completedTo?: string
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
      completedAt:
        options?.completedFrom || options?.completedTo
          ? {
              gte: options?.completedFrom || undefined,
              lte: options?.completedTo || undefined,
            }
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
          color: true,
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
