import { getGoals } from "@/backend/goal"
import { statuses } from "@/constants/statuses"
import { EmailTemplate } from "@/emails/morning"
import dayjs from "dayjs"
import dotenv from "dotenv"
import OpenAI from "openai"
import { Resend } from "resend"

import prisma from "@/lib/db"

import { getProjects } from "../backend/project"
import { getTasksPreview } from "../backend/task"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)
const userId = "8fe16f1b-11ca-43e5-a56e-5532cb2e9333"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function sendMorningEmail() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    const goals = await getGoals(userId)
    const projects = await getProjects(userId)
    const overdue = await getTasksPreview(userId, {
      hideCompleted: true,
      to: dayjs().endOf("day").subtract(1, "day").toISOString(),
    })

    const today = await getTasksPreview(userId, {
      hideCompleted: true,
      to: dayjs().endOf("day").toISOString(),
    })

    const completedYesterday = await getTasksPreview(userId, {
      statuses: ["ARCHIVE"],
      completedFrom: dayjs().startOf("day").subtract(1, "day").toISOString(),
      completedTo: dayjs().endOf("day").subtract(1, "day").toISOString(),
    })
    const inbox = await getTasksPreview(userId, {
      statuses: ["INBOX"],
    })

    const feedbackPrompt = `
      You are an assistant to ${
        user?.name || ""
      }. He's a busy person with a busy job.
      Your role - Getting Things Done (GTD) Assistant - is to help him acheive his goals and be happy.

      I'm sending you now a list of his goals, projects, today tasks, overdue tasks, tasks that were completed yesterday, and last & next week tasks.

      Your job is to make sure that ${
        user?.name || ""
      } work is prioritized, and that he's working on the right thing, and not getting burned out.

      Based on the following data, please return a prioritized list of tasks for ${
        user?.name || ""
      } to work on today.
      The list should be ordered by priority.
      For each tasks in the lists that are not completed, provide:
      1. priority score between 0-100.
      2. priority reason - why this task is important.
      
      This will be shown to the user in the app.
      Return a valid JSON and valid JSON only.
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
      Overdue: ${overdue
        ?.map(
          ({ title, status, project }) =>
            `title: ${title}; ${
              project?.id ? `projectId: ${project.id}` : ""
            }; status: ${status}`
        )
        .join(",")}
      Today: ${today?.map(
        ({ title, status, project }) =>
          `title: ${title}; ${
            project?.id ? `projectId: ${project.id}` : ""
          }; status: ${status}`
      )}
      Completed: ${completedYesterday?.map(
        ({ title, status, project }) =>
          `title: ${title}; ${
            project?.id ? `projectId: ${project.id}` : ""
          }; status: ${status}`
      )}
      Inbox: ${inbox?.map(({ title }) => title).join(", ")}

      Thank you!
    `

    const priority = await openai.chat.completions.create({
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

            Your goal is providing a priority score for the user tasks based on the data that I'll send you in the prompt.
            The score is a number between 0-100, where 100 is the most important task.
            You must return a valid JSON.
            It will be shared with a user through the app.
        `,
        },
        { role: "user", content: feedbackPrompt },
      ],
      model: "gpt-4",
    })

    const dayBuilderPrompt = `
      You are the getting things done god. Your job is an assistant to users of my app, called Current. The app help people stay present in their daily life while acheiving their goals
      by automatically prioritzie their tasks and projects.
      Your goal is to build a day for the user based on the data that I'll send you in the prompt.
      The day should be built based on the following principles:
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

      This is the data that you'll get:
      - Prioritized list of the user daily tasks.

      Please provide:
      - Time estimation for each task
      - Daily schedule

      Remember to leave buffer time for the user to rest and relax.

      --- 
      Here's the data:
      Prioritized list of the user daily tasks: ${JSON.stringify(
        priority.choices?.[0]?.message.content || "",
        null,
        2
      )}
      `

    const dayBuilder = await openai.chat.completions.create({
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

            Your goal is providing a priority score for the user tasks based on the data that I'll send you in the prompt.
            The score is a number between 0-100, where 100 is the most important task.
            You must return a valid JSON.
            It will be shared with a user through the app.
        `,
        },
        { role: "user", content: dayBuilderPrompt },
      ],
      model: "gpt-4",
    })
    console.log(
      dayBuilder.choices?.[0]?.message.content || "",
      priority.choices?.[0]?.message.content || ""
    )
  } catch (error) {
    console.log(error)
  }
}

sendMorningEmail()
