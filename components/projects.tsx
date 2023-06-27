import { ChevronDown, Flower2 } from "lucide-react"

import { CreateProject } from "./create-project"
import { ProjectForm } from "./project-form"
import { ProjectsList } from "./projects-list"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

export const Projects = () => {
  return (
    <Collapsible className="flex flex-col gap-6 w-full" defaultOpen>
      <CollapsibleTrigger>
        <div className="flex items-center justify-between w-full cursor-pointer px-8">
          <div className="flex items-center gap-2">
            <Flower2 />
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Projects
            </h3>
            <ChevronDown />
          </div>
          <CreateProject />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ProjectsList />
      </CollapsibleContent>
    </Collapsible>
  )
}
