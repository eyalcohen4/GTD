import { ChangeEvent, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { SearchIcon } from "lucide-react"

import { useGetTasks } from "@/hooks/tasks"

import { useProjects } from "./providers/projects-provider"
import { useSearch } from "./providers/search-provider"
import { TaskListItem } from "./task-list-item"
import { TasksList } from "./tasks-list"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

export const Search = () => {
  const [query, setQuery] = useState("")
  const { isOpen, toggle } = useSearch()
  const debouncedQuery = useDebounce(query, 500)
  const { tasks } = useGetTasks({
    includeCompleted: true,
    search: debouncedQuery,
    skip: !debouncedQuery,
  })
  const { projects } = useProjects()
  const possibleProjects = projects?.filter((project) =>
    project.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => toggle()}>
      <DialogTrigger>
        <Button variant="ghost">
          <SearchIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-scroll md:min-h-[400px] min-w-[75%]">
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <SearchIcon />
            <Input
              type="text"
              className="w-full bg-transparent focus:outline-none"
              placeholder="Search"
              onChange={handleChange}
              value={query}
            />
          </div>
          <div className="w-full">
            {tasks?.map((task) => (
              <TaskListItem task={task} hideComplete />
            ))}
          </div>
          <div>
            {possibleProjects?.map((project) => (
              <TaskListItem task={project} hideComplete />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
