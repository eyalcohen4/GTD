import { statuses } from "@/constants/statuses"
import { EmailTemplate } from "@/emails/morning"
import dayjs from "dayjs"
import dotenv from "dotenv"
import { Resend } from "resend"

import prisma from "@/lib/db"

import { getProjects } from "../backend/project"
import { getTasksPreview } from "../backend/task"

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)
const userId = "8fe16f1b-11ca-43e5-a56e-5532cb2e9333"

async function sendMorningEmail() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

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

    const data = await resend.emails.send({
      from: "Stay Current <morning@staycurrent.app>",
      to: ["eyalcohen4.ec@gmail.com"],
      subject: `Your Current Morning: ${dayjs().format(
        "MMMM D, YYYY"
      )} Morning`,
      react: EmailTemplate({
        firstName: user?.name || "",
        // @ts-ignore
        projects,
        overdue,
        today,
        completed: completedYesterday,
        inbox,
      }),
    })
    console.log("yoyo")
  } catch (error) {
    console.log(error)
  }
}

sendMorningEmail()
