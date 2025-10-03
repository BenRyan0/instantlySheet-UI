import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

function ProgressImage({
  className,
  value,
  indicatorImage = "/gif/race.gif", // pass a custom image path
  ...props
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        " relative h-10 w-full overflow-hidden rounded-full ",
        className
      )}
      {...props}
    >
      {/* Filled portion */}
      <div
        className=" h-6/12 absolute bottom-0  transition-all duration-400 bg-transparent bg-gradient-to-l to-transparent ease-in-out from-gray-500/10 "
        style={{ width: `${value || 0}%` }}
      />

      {/* Image indicator */}
      <img
        src={indicatorImage}
        alt="progress-indicator"
        className="absolute top-9  h-12 w-12 rotate-26"
        style={{ left: `${value || 0}%`, transform: "translate(-50%, -50%)" }}
      />
    </ProgressPrimitive.Root>
  )
}

export { ProgressImage }
