import { CreateGoal } from "./create-goal"
import { GoalsList } from "./goals-list"

export const Goals = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 13V2l8 4-8 4" />
            <path d="M20.55 10.23A9 9 0 1 1 8 4.94" />
            <path d="M8 10a5 5 0 1 0 8.9 2.02" />
          </svg>
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Goals
          </h3>
        </div>
        <CreateGoal />
      </div>
      <GoalsList />
    </div>
  )
}
