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

      Every morning, you'll get a list of tasks that are due today, tasks that are overdue, and tasks that were completed yesterday.

      Your job is to make sure that ${
        user?.name || ""
      } work is prioritized, and that he's working on the right thing, and not getting burned out.

      Please generate a short feedback report of 400 chars or less based on the data above. 
      This will be included in a morning report sent to ${user?.name || ""}.
      The feedback should be very specific about the user tasks, and should help him start his day the best way possible.
      Anything general or useless will be ignored and will not be included in the report.
      The user need to finish his day with the 2-3 most important tasks completed so he'll feel good. 

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

            Your goal is providing a 300 char feedback for the user, based on the data that I'll send you in the prompt.
            The feedback should be short, and to the point.
            It will be shared with a user in their morning email report from their app.
            Please help the user start his day the best way possible.
            Be very concise in your feedback, and don't include kitchey words.
        `,
        },
        { role: "user", content: feedbackPrompt },
      ],
      model: "gpt-4",
    })

    const data = await resend.emails.send({
      from: "Stay Current <morning@staycurrent.app>",
      to: ["eyalcohen4.ec@gmail.com"],
      subject: `Your Current Morning: ${dayjs().format(
        "MMMM D, YYYY"
      )} Morning`,
      react: EmailTemplate({
        firstName: user?.name || "",
        aiFeedback: aiFeedback.choices?.[0]?.message.content || "",
        // @ts-ignore
        projects,
        overdue,
        today,
        completed: completedYesterday,
        inbox,
      }),
    })
  } catch (error) {
    console.log(error)
  }
}

sendMorningEmail()
