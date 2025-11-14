import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner1({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-5 animate-spin", className)}
      {...props}
    />
  )
}

export function Spinner() {
  return (
    <div className="flex items-center gap-4">
      <Spinner1 />
    </div>
  )
}
