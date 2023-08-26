"use client"

import { useTasks } from "./providers/tasks-provider"

export const GlobalLoader = () => {
  const { loadingGetTasks } = useTasks()

  return loadingGetTasks ? (
    <div className="bg-background/75 absolute top-0 left-0 h-screen w-screen z-50">
      <div className="h-full w-full flex flex-col items-center justify-center gap-2">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-slate-100"></div>
        <div className="text-slate-900 dark:text-slate-100 text-2xl font-bold ml-4">
          Remember to Stay Current
        </div>
      </div>
    </div>
  ) : null
}
