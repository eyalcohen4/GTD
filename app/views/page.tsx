"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function Projects() {
  return (
    <div>
      <div className="flex justify-between items-center px-8">
        <h1 className="scroll-m-20 text-lg font-medium lg:text-3xl mb-4 p-8">
          Views
        </h1>
        <Dialog>
          <DialogTrigger>
            <Button>Create View</Button>
          </DialogTrigger>
          <DialogContent>
            <CreateView />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4"></div>
    </div>
  )
}

const CreateView = () => {
  
}
