import { ChangeEvent, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { SearchIcon } from "lucide-react"

import { useGetTasks } from "@/hooks/tasks"

import { TaskListItem } from "./task-list-item"
import { TasksList } from "./tasks-list"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

export const Search = () => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const { tasks } = useGetTasks({
    includeCompleted: true,
    search: debouncedQuery,
    skip: !debouncedQuery,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  console.log(tasks)

  return (
    <Dialog>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
