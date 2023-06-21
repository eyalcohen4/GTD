import { Flower2 } from "lucide-react"

import { CreateProject } from "./create-project"
import { ProjectForm } from "./project-form"
import { ProjectsList } from "./projects-list"

export const Projects = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Flower2 />
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Projects
          </h3>
        </div>
        <CreateProject />
      </div>
      <ProjectsList />
    </div>
  )
}
