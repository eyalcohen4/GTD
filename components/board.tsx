import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Calendar, Plus, Search } from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { Task } from "@/types/task";
import {
  useCreateColumn,
  useCreateColumnTask,
  useGetBoard,
  useGetColumnsTasks,
  useUpdateColumn,
  useUpdateColumnTask,
} from "@/hooks/boards";
import { useGetTasks } from "@/hooks/tasks";

import { TaskBadges, TaskListItem } from "./task-list-item";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { Column, ColumnInput } from "@/types/board";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { Filter } from "./filter";
import dayjs from "dayjs";

const skeleton = new Array(3).fill("");
export const Board = ({ boardId }: { boardId: string }) => {
  const { data, isLoading } = useGetBoard(boardId);
  const { mutate: updateTaskColumn } = useUpdateColumnTask();
  const [showCreate, setShowCreate] = useState(false);
  
  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    // Check if the task was moved within the same column
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    await updateTaskColumn({
      from: source.droppableId,
      index: destination.index,
      id: draggableId,
      input: { columnId: destination.droppableId , order: destination.index },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex w-full flex-row justify-between gap-4 overflow-x-auto whitespace-nowrap">
        {isLoading
          ? skeleton.map((_, index) => (
              <div className="rounded-lg min-w-96 w-full" key={index}>
                <h2 className=" dark:hover:bg-gray-800 hover:bg-gray-100 text-lg font-semibold p-2 pl-0">
                  <Skeleton className="h-2 w-full" />
                </h2>
                <div className="flex flex-col gap-2 rounded-lg p-4 pl-0">
                  <div>
                    <Skeleton className="h-1 w-8" />
                  </div>
                </div>
              </div>
            ))
          : null}
        <Dialog open={showCreate}
        onOpenChange={(open) => setShowCreate(open)}
        >
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-xs mt-1">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[65%] p-0">
          <ColumnForm boardId={boardId} onCreated={() => {
            setShowCreate(false)
          }}/>
        </DialogContent>
        </Dialog>
        {data?.board?.columns?.map((column) => (
          <Column column={column} boardId={boardId} key={column.id} />
        ))}
      </div>
    </DragDropContext>
  );
};

const Column = ({ column, boardId }: { column: Column; boardId: string }) => {
  const { mutate } = useUpdateColumn(boardId);

  const handleColumnTitleChange = (e: any) => {
    mutate({
      id: column.id,
      input: { title: e.target.innerHTML },
    });
  };

  return (
    <div className="rounded-lg min-w-[350px]">
      <h2
        className="text-lg font-semibold p-2 pl-0 py-2"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleColumnTitleChange}
      >
        {column.title}
      </h2>
      <div>
        <div className={cn("flex flex-col gap-2 rounded-lg p-4 pl-0")}>
          <ColumnTasks columnId={column.id} boardId={boardId} />
        </div>
      </div>
    </div>
  );
};

const ColumnTasks = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const { data, isLoading } = useGetColumnsTasks(boardId, columnId);

  return (
    <div className="w-full">
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <div
              className="w-full flex text-sm items-center gap-4 
         dark:hover:bg-gray-800 hover:bg-gray-100
         text-gray-500 cursor-pointer py-2 rounded-lg
        "
            >
              <Plus /> Add
            </div>
          </DialogTrigger>
          <DialogContent className="min-w-[65%] p-0">
            <SelectTask boardId={boardId} columnId={columnId} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="mt-2 flex flex-col gap-4 p-2">
          <Card className="h-16 w-full p-2">
            <Skeleton className="h-1 w-8" />
          </Card>
        </div>
      ) : null}
      <Droppable key={columnId} droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "mt-2 flex flex-col gap-4 p-2 pl-0",
              snapshot.isDraggingOver ? "border border-dashed" : "",
            )}
          >
            {data?.tasks?.sort((a,b) => a.order > b.order ? 1 : -1).map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(draggableProvided, draggingSnapshot) => (
                  <Link href={`/task/${task.taskId}`} key={task.id} ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                  >
                    <Card

                      className={cn(
                        "whitespace-normal cursor-pointer py-2 px-4 flex flex-col gap-4 h-full hover:bg-gray-100 dark:hover:bg-gray-900",
                        draggingSnapshot.isDragging
                          ? "bg-gray-100 dark:bg-gray-900"
                          : "",
                      )}
                    >
                      <p className="text-sm">{task.task.title}</p>
                      <TaskBadges task={task.task} />
                    </Card>
                    {provided.placeholder}
                  </Link>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const SelectTask = ({
  boardId,
  columnId,
}: {
  boardId: string;
  columnId: string;
}) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { mutate } = useCreateColumnTask(boardId, columnId);
  const { tasks } = useGetTasks({
    includeCompleted: false,
    search: debouncedQuery,
  });

  const selectTask = async (task: { id: string }) => {
    await mutate({ taskId: task.id, columnId });
  };

  return (
    <div className="overflow-scroll h-[800px] mt-8">
      <div className="p-4 flex items-center gap-4">
        <Search />
        <Input
          placeholder="Search tasks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mt-4">
        {tasks?.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            hideComplete
            onClick={() => selectTask(task)}
          />
        ))}
      </div>
    </div>
  );
};

export const ColumnForm = ({
  boardId,
  onCreated,
}: {
  boardId: string;
  onCreated: () => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const { mutate } = useCreateColumn(boardId);

  const handleCreate = async () => {
    await mutate({
      title,
      boardId,
    });
    onCreated();
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-4">
          <textarea
            className="w-full border-0 h-8 bg-transparent border-transparent text-2xl text-slate-900 dark:text-slate-100 font-medium"
            placeholder={"Goal Title"}
            value={title || ""}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleCreate}>Create</Button>
      </DialogFooter>
    </div>
  );
};
