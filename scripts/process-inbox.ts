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

    const completedThisWeek = await getTasksPreview(userId, {
      statuses: ["ARCHIVE"],
      completedFrom: dayjs().startOf("day").subtract(1, "week").toISOString(),
      completedTo: dayjs().endOf("day").subtract(1, "day").toISOString(),
    })

    const plannedForNext3Days = await getTasksPreview(userId, {
      hideCompleted: true,
      from: dayjs().startOf("day").toISOString(),
      to: dayjs().endOf("day").add(3, "day").toISOString(),
    })
    const overdue = await getTasksPreview(userId, {
      hideCompleted: true,
      to: dayjs().endOf("day").subtract(1, "day").toISOString(),
    })

    const today = await getTasksPreview(userId, {
      hideCompleted: true,
      to: dayjs().endOf("day").toISOString(),
    })

    const contexts = await prisma.context.findMany({
      where: {
        userId,
      },
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

      Your job is to process ${
        user?.name || ""
      } inbox based on the Getting Things Done process flow method.
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

      Provide back this data structure:
      {
        "tasks": [
          {
            "taskId": "task id",
            "task title: "task title",
            "recommendation": "recommendation summary",
            gtd: {
              "actionable": true | false,
              "multiStep": true | false,
              "nextAction": "next action",
              "defer": true | false
              "delegate": true | false
              "2min": true | false
              "reference": true | false
              "incubate": true | false
              "trash": true | false
            }            
            params: {
              "date": "date",
              "project": "projectId from projects list",
              "person": "person",
              "status": "status",
              "context": "context",
            }
          }
      } 
      
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
       Completed This Week: ${completedThisWeek?.map(
         ({ title, status, project }) =>
           `title: ${title}; ${
             project?.id ? `projectId: ${project.id}` : ""
           }; status: ${status}`
       )}
      Planned For Next 3 Days: ${plannedForNext3Days?.map(
        ({ title, status, project }) =>
          `title: ${title}; ${
            project?.id ? `projectId: ${project.id}` : ""
          }; status: ${status}`
      )}
      Contexts: ${contexts?.map(({ title }) => title).join(", ")}

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

      ----- 
      Here's the inbox tasks:
      Inbox: ${inbox?.map(({ title }) => title).join(", ")}

      Thank you!
    `

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

            Your goal is to process the user inbox the best that you can, based on the getting things done method of processing inbox items.
            This is so the user can live by the above principles.

            You must return a valid JSON.
            It will be shared with a user through the app.
        `,
        },
        { role: "user", content: feedbackPrompt },
      ],
      model: "gpt-4",
    })

    console.log(aiFeedback.choices?.[0]?.message.content || "")
  } catch (error) {
    console.log(error)
  }
}

sendMorningEmail()
