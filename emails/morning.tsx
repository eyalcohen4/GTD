import * as React from "react"
import { goalsStatuses, statuses } from "@/constants/statuses"
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import dayjs from "dayjs"

import { Project } from "@/types/project"
import { TaskPreview } from "@/types/task"

interface EmailTemplateProps {
  firstName: string
  overdue: TaskPreview[]
  today: TaskPreview[]
  projects: Array<
    Project & {
      progress: {
        all: number
        completed: number
        inbox: number
        waitingFor: number
        nextAction: number
        somedayMaybe: number
      }
    }
  >
  inbox: Array<TaskPreview>
  completed: Array<TaskPreview>
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  completed,
  overdue,
  today,
  projects,
  inbox,
}) => (
  <Html>
    <Head />
    <Preview>Remember To Be Current</Preview>
    <Body style={main}>
      <Section
        style={{
          width: "100%",
          margin: "auto",
        }}
      >
        <Column
          style={{
            textAlign: "center",
          }}
        >
          <Img
            height={50}
            width={50}
            src="https://staycurrent.app/logo.png"
            alt="Remember To Be Current"
          />
        </Column>
        <Column
          style={{
            textAlign: "center",
          }}
        >
          <Text style={{ margin: "24px 0 0 0" }}>
            <Link href="https://staycurrent.app">
              {" "}
              <Text
                style={{
                  textDecoration: "underline",
                  color: "#020617",
                }}
              >
                Current
              </Text>
            </Link>
          </Text>
        </Column>
      </Section>
      <Container style={container}>
        <Section>
          <Heading style={h1}>{dayjs().format("dddd, MMMM DD")}</Heading>
          <Text
            style={{
              fontSize: "16px",
            }}
          >
            {firstName?.split(" ")?.[0] || firstName}, Good Morning ☀️
          </Text>
          <Text style={text}>
            Here is your morning report so you can be current today.
          </Text>
        </Section>
        <Section style={aiFeedback}>
          <Text
            style={{
              fontWeight: "bold",
              padding: "0 16px",
              verticalAlign: "middle",
            }}
          >
            🤖 AI Feedback
          </Text>
        </Section>
        <Hr />
        <Section>
          <Column>
            <Button
              style={{
                backgroundColor: "#60a5fa",
                color: "#fff",
                padding: "16px 0px",
                borderRadius: "12px",
                border: "none",
                margin: "16px auto",
                textDecoration: "none",
                maxWidth: "100%",
                width: "250px",
                fontWeight: "bold",
              }}
            >
              Process Inbox (5 minutes)
            </Button>
          </Column>
          <Column>
            <Button
              style={{
                backgroundColor: "#60a5fa",
                color: "#fff",
                padding: "16px 0px",
                borderRadius: "12px",
                border: "none",
                margin: "16px auto",
                textDecoration: "none",
                maxWidth: "100%",
                width: "250px",
                fontWeight: "bold",
              }}
            >
              Add Tasks
            </Button>
          </Column>
        </Section>
        <Hr />
        <Section>
          <Text style={sectionHeader}>Tasks you completed yesterday</Text>
          {completed.length > 0 ? (
            completed.map((task) => <Task task={task} />)
          ) : (
            <Text style={text}>You have no tasks completed yesterday.</Text>
          )}
        </Section>
        <Hr />
        <Section>
          <Text style={sectionHeader}>Tasks to complete today</Text>
          {completed.length > 0 ? (
            completed.map((task) => <Task task={task} />)
          ) : (
            <Text style={text}>You have no tasks due today.</Text>
          )}
        </Section>
        <Hr />
        <Section>
          <Text style={sectionHeader}>Overdue Tasks</Text>
          {overdue.length > 0 ? (
            overdue.map((task) => <Task task={task} />)
          ) : (
            <Text style={text}>You have no overdue tasks.</Text>
          )}
        </Section>
        <Hr />
        <Section>
          <Text style={sectionHeader}>Inbox</Text>
          {inbox.length > 0 ? (
            inbox.map((task) => <Task task={task} noSubtitle />)
          ) : (
            <Text style={text}>You have no overdue tasks.</Text>
          )}
        </Section>
        <Hr />
        <Section>
          <Text style={sectionHeader}>Projects</Text>
          <Row>
            <Column>
              <Text style={{ fontSize: "14px", color: "GrayText" }}>Name</Text>
            </Column>
            <Column>
              <Text
                style={{
                  fontSize: "14px",
                  color: "GrayText",
                  textAlign: "right",
                }}
              >
                Status
              </Text>
            </Column>
          </Row>
          {projects?.length
            ? projects
                .sort((a, b) => {
                  const aStatus = goalsStatuses.find(
                    (s) => s.value === a.status
                  ) || { order: 1 }
                  const bStatus = goalsStatuses.find(
                    (s) => s.value === b.status
                  ) || { order: 1 }

                  return aStatus.order > bStatus.order ? 1 : -1
                })
                .map((project) => <ProjectListItem project={project} />)
            : null}
        </Section>
      </Container>
    </Body>
  </Html>
)

const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => {
  const status = goalsStatuses.find((s) => s.value === project.status)

  return (
    <Row>
      <Column>
        <Link href={`https://staycurrent.app/project/${project.id}`}>
          <Text
            style={{
              textDecoration: "underline",
              color: "#020617",
            }}
          >
            {project.title}
          </Text>
        </Link>
      </Column>
      <Column>
        <Text
          style={{
            textAlign: "right",
            backgroundColor: status?.color,
            borderRadius: "12px",
            padding: "4px 8px",
            color: "#fff",
            width: "fit-content",
            float: "right",
          }}
        >
          {status?.label || project.status}
        </Text>
      </Column>
    </Row>
  )
}

const Task: React.FC<{ task: TaskPreview; noSubtitle?: boolean }> = ({
  task,
  noSubtitle,
}) => {
  const status = statuses.find((s) => s.value === task.status)

  return (
    <Row
      style={{
        margin: "16px 0 0 0",
        display: "block",
      }}
    >
      <Section>
        <Link href={`https://staycurrent.app/task/${task.id}`}>
          <Text
            style={{
              textDecoration: "underline",
              fontWeight: "bold",
              color: "#020617",
              margin: 0,
            }}
          >
            {task.title}
          </Text>
        </Link>
        {!noSubtitle && (
          <Text
            style={{
              textAlign: "left",
              margin: 0,
              fontSize: "14px",
              color: "GrayText",
            }}
          >
            {status?.label || ""} |{" "}
            {dayjs(task.dueDate).format("dddd, MMMM DD")}
          </Text>
        )}
      </Section>
    </Row>
  )
}

const main = {
  backgroundColor: "#e2e8f0",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
  backgroundColor: "#f9fafb",
  margin: "auto",
  padding: "32px",
}

const h1 = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
}

const text = {
  color: "#0f172a",
  fontSize: "14px",
}

const sectionHeader = {
  fontSize: "24px",
  fontWeight: "bold",
}

const aiFeedback = {
  borderRadius: "12px",
  backgroundColor: "#86efac",
}
